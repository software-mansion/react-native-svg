/* Fast open-addressing concurrent hash table.
 *
 * Copyright 2023 Joaquin M Lopez Munoz.
 * Distributed under the Boost Software License, Version 1.0.
 * (See accompanying file LICENSE_1_0.txt or copy at
 * http://www.boost.org/LICENSE_1_0.txt)
 *
 * See https://www.boost.org/libs/unordered for library home page.
 */

#ifndef BOOST_UNORDERED_DETAIL_FOA_CONCURRENT_TABLE_HPP
#define BOOST_UNORDERED_DETAIL_FOA_CONCURRENT_TABLE_HPP

#include <atomic>
#include <boost/assert.hpp>
#include <boost/config.hpp>
#include <boost/core/ignore_unused.hpp>
#include <boost/core/no_exceptions_support.hpp>
#include <boost/cstdint.hpp>
#include <boost/mp11/tuple.hpp>
#include <boost/static_assert.hpp>
#include <boost/unordered/detail/foa/core.hpp>
#include <boost/unordered/detail/foa/rw_spinlock.hpp>
#include <boost/unordered/detail/foa/tuple_rotate_right.hpp>
#include <cstddef>
#include <functional>
#include <initializer_list>
#include <memory>
#include <new>
#include <type_traits>
#include <tuple>
#include <utility>

#if !defined(BOOST_UNORDERED_DISABLE_PARALLEL_ALGORITHMS)
#if defined(BOOST_UNORDERED_ENABLE_PARALLEL_ALGORITHMS)|| \
    !defined(BOOST_NO_CXX17_HDR_EXECUTION)
#define BOOST_UNORDERED_PARALLEL_ALGORITHMS
#endif
#endif

#if defined(BOOST_UNORDERED_PARALLEL_ALGORITHMS)
#include <algorithm>
#include <execution>
#endif

namespace boost{
namespace unordered{
namespace detail{

#if defined(BOOST_UNORDERED_PARALLEL_ALGORITHMS)

template<typename ExecutionPolicy>
using is_execution_policy=std::is_execution_policy<
  typename std::remove_cv<
    typename std::remove_reference<ExecutionPolicy>::type
  >::type
>;

#else

template<typename ExecutionPolicy>
using is_execution_policy=std::false_type;

#endif

namespace foa{

static constexpr std::size_t cacheline_size=64;

template<typename T,std::size_t N>
class cache_aligned_array
{
public:
  cache_aligned_array(){for(std::size_t n=0;n<N;)::new (data(n++)) T();}
  ~cache_aligned_array(){for(auto n=N;n>0;)data(n--)->~T();}
  cache_aligned_array(const cache_aligned_array&)=delete;
  cache_aligned_array& operator=(const cache_aligned_array&)=delete;

  T& operator[](std::size_t pos)noexcept{return *data(pos);}

private:
  static constexpr std::size_t element_offset=
    (sizeof(T)+cacheline_size-1)/cacheline_size*cacheline_size;

  BOOST_STATIC_ASSERT(alignof(T)<=cacheline_size);

  T* data(std::size_t pos)noexcept
  {
    return reinterpret_cast<T*>(
      (reinterpret_cast<uintptr_t>(&buf)+cacheline_size-1)/
        cacheline_size*cacheline_size
      +pos*element_offset);
  }

  unsigned char buf[element_offset*N+cacheline_size-1];
};

template<typename Mutex,std::size_t N>
class multimutex
{
public:
  constexpr std::size_t size()const noexcept{return N;}

  Mutex& operator[](std::size_t pos)noexcept
  {
    BOOST_ASSERT(pos<N);
    return mutexes[pos];
  }

  void lock()noexcept{for(std::size_t n=0;n<N;)mutexes[n++].lock();}
  void unlock()noexcept{for(auto n=N;n>0;)mutexes[--n].unlock();}

private:
  cache_aligned_array<Mutex,N> mutexes;
};

/* std::shared_lock is C++14 */

template<typename Mutex>
class shared_lock
{
public:
  shared_lock(Mutex& m_)noexcept:m{m_}{m.lock_shared();}
  ~shared_lock()noexcept{if(owns)m.unlock_shared();}

  /* not used but VS in pre-C++17 mode needs to see it for RVO */
  shared_lock(const shared_lock&);

  void lock(){BOOST_ASSERT(!owns);m.lock_shared();owns=true;}
  void unlock(){BOOST_ASSERT(owns);m.unlock_shared();owns=false;}

private:
  Mutex &m;
  bool owns=true;
};

/* VS in pre-C++17 mode can't implement RVO for std::lock_guard due to
 * its copy constructor being deleted.
 */

template<typename Mutex>
class lock_guard
{
public:
  lock_guard(Mutex& m_)noexcept:m{m_}{m.lock();}
  ~lock_guard()noexcept{m.unlock();}

  /* not used but VS in pre-C++17 mode needs to see it for RVO */
  lock_guard(const lock_guard&);

private:
  Mutex &m;
};

/* inspired by boost/multi_index/detail/scoped_bilock.hpp */

template<typename Mutex>
class scoped_bilock
{
public:
  scoped_bilock(Mutex& m1,Mutex& m2)noexcept
  {
    bool mutex_lt=std::less<Mutex*>{}(&m1,&m2);

    pm1=mutex_lt?&m1:&m2;
    pm1->lock();
    if(&m1==&m2){
      pm2=nullptr;
    }
    else{
      pm2=mutex_lt?&m2:&m1;
      pm2->lock();
    }
  }

  /* not used but VS in pre-C++17 mode needs to see it for RVO */
  scoped_bilock(const scoped_bilock&);

  ~scoped_bilock()noexcept
  {
    if(pm2)pm2->unlock();
    pm1->unlock();
  }

private:
  Mutex *pm1,*pm2;
};

/* use atomics for group metadata storage */

template<typename Integral>
struct atomic_integral
{
  operator Integral()const{return n.load(std::memory_order_relaxed);}
  void operator=(Integral m){n.store(m,std::memory_order_relaxed);}
  void operator|=(Integral m){n.fetch_or(m,std::memory_order_relaxed);}
  void operator&=(Integral m){n.fetch_and(m,std::memory_order_relaxed);}

  atomic_integral& operator=(atomic_integral const& rhs) {
    n.store(rhs.n.load(std::memory_order_relaxed),std::memory_order_relaxed);
    return *this;
  }

  std::atomic<Integral> n;
};

/* Group-level concurrency protection. It provides a rw mutex plus an
 * atomic insertion counter for optimistic insertion (see
 * unprotected_norehash_emplace_or_visit).
 */

struct group_access
{    
  using mutex_type=rw_spinlock;
  using shared_lock_guard=shared_lock<mutex_type>;
  using exclusive_lock_guard=lock_guard<mutex_type>;
  using insert_counter_type=std::atomic<boost::uint32_t>;

  shared_lock_guard    shared_access(){return shared_lock_guard{m};}
  exclusive_lock_guard exclusive_access(){return exclusive_lock_guard{m};}
  insert_counter_type& insert_counter(){return cnt;}

private:
  mutex_type          m;
  insert_counter_type cnt{0};
};

template<std::size_t Size>
group_access* dummy_group_accesses()
{
  /* Default group_access array to provide to empty containers without
   * incurring dynamic allocation. Mutexes won't actually ever be used,
   * (no successful reduced hash match) and insertion counters won't ever
   * be incremented (insertions won't succeed as capacity()==0).
   */

  static group_access accesses[Size];

  return accesses;
}

/* subclasses table_arrays to add an additional group_access array */

template<typename Value,typename Group,typename SizePolicy>
struct concurrent_table_arrays:table_arrays<Value,Group,SizePolicy>
{
  using super=table_arrays<Value,Group,SizePolicy>;

  concurrent_table_arrays(const super& arrays,group_access *pga):
    super{arrays},group_accesses{pga}{}

  template<typename Allocator>
  static concurrent_table_arrays new_(Allocator& al,std::size_t n)
  {
    concurrent_table_arrays arrays{super::new_(al,n),nullptr};
    if(!arrays.elements){
      arrays.group_accesses=dummy_group_accesses<SizePolicy::min_size()>();
    }
    else{
      using access_alloc=
        typename boost::allocator_rebind<Allocator,group_access>::type;
      using access_traits=boost::allocator_traits<access_alloc>;

      BOOST_TRY{
        auto aal=access_alloc(al);
        arrays.group_accesses=boost::to_address(
          access_traits::allocate(aal,arrays.groups_size_mask+1));

        for(std::size_t i=0;i<arrays.groups_size_mask+1;++i){
          ::new (arrays.group_accesses+i) group_access();
        }
      }
      BOOST_CATCH(...){
        super::delete_(al,arrays);
        BOOST_RETHROW
      }
      BOOST_CATCH_END
    }
    return arrays;
  }

  template<typename Allocator>
  static void delete_(Allocator& al,concurrent_table_arrays& arrays)noexcept
  {
    if(arrays.elements){
      using access_alloc=
        typename boost::allocator_rebind<Allocator,group_access>::type;
      using access_traits=boost::allocator_traits<access_alloc>;
      using pointer=typename access_traits::pointer;
      using pointer_traits=boost::pointer_traits<pointer>;

      auto aal=access_alloc(al);
      access_traits::deallocate(
        aal,pointer_traits::pointer_to(*arrays.group_accesses),
        arrays.groups_size_mask+1);
    }
    super::delete_(al,arrays);
  }

  group_access *group_accesses;
};

struct atomic_size_control
{
  static constexpr auto atomic_size_t_size=sizeof(std::atomic<std::size_t>);
  BOOST_STATIC_ASSERT(atomic_size_t_size<cacheline_size);

  atomic_size_control(std::size_t ml_,std::size_t size_):
    pad0_{},ml{ml_},pad1_{},size{size_}{}
  atomic_size_control(atomic_size_control& x):
    pad0_{},ml{x.ml.load()},pad1_{},size{x.size.load()}{}

  /* padding to avoid false sharing internally and with sorrounding data */

  unsigned char            pad0_[cacheline_size-atomic_size_t_size];
  std::atomic<std::size_t> ml;
  unsigned char            pad1_[cacheline_size-atomic_size_t_size];
  std::atomic<std::size_t> size;
};

/* std::swap can't be used on non-assignable atomics */

inline void
swap_atomic_size_t(std::atomic<std::size_t>& x,std::atomic<std::size_t>& y)
{
  std::size_t tmp=x;
  x=static_cast<std::size_t>(y);
  y=tmp;
}

inline void swap(atomic_size_control& x,atomic_size_control& y)
{
  swap_atomic_size_t(x.ml,y.ml);
  swap_atomic_size_t(x.size,y.size);
}

/* foa::concurrent_table serves as the foundation for end-user concurrent
 * hash containers. The TypePolicy parameter can specify flat/node-based
 * map-like and set-like containers, though currently we're only providing
 * boost::concurrent_flat_map.
 * 
 * The exposed interface (completed by the wrapping containers) is not that
 * of a regular container (in fact, it does not model Container as understood
 * by the C++ standard):
 * 
 *   - Iterators are not provided as they are not suitable for concurrent
 *     scenarios.
 *   - As a consequence, composite operations with regular containers
 *     (like, for instance, looking up an element and modifying it), must
 *     be provided natively without any intervening iterator/accesor.
 *     Visitation is a core concept in this design, either on its own (eg.
 *     visit(k) locates the element with key k *and* accesses it) or as part
 *     of a native composite operation (eg. try_emplace_or_visit). Visitation
 *     is constant or mutating depending on whether the used table function is
 *     const or not.
 *   - The API provides member functions for all the meaningful composite
 *     operations of the form "X (and|or) Y", where X, Y are one of the
 *     primitives FIND, ACCESS, INSERT or ERASE.
 *   - Parallel versions of [c]visit_all(f) and erase_if(f) are provided based
 *     on C++17 stdlib parallel algorithms.
 * 
 * Consult boost::unordered_flat_map docs for the full API reference.
 * Heterogeneous lookup is suported by default, that is, without checking for
 * any ::is_transparent typedefs --this checking is done by the wrapping
 * containers.
 *
 * Thread-safe concurrency is implemented using a two-level lock system:
 * 
 *   - A first container-level lock is implemented with an array of
 *     rw spinlocks acting as a single rw mutex with very little
 *     cache-coherence traffic on read (each thread is assigned a different
 *     spinlock in the array). Container-level write locking is only used for
 *     rehashing and other container-wide operations (assignment, swap, etc.)
 *   - Each group of slots has an associated rw spinlock. A thread holds
 *     at most one group lock at any given time. Lookup is implemented in
 *     a (groupwise) lock-free manner until a reduced hash match is found, in
 *     which case the relevant group is locked and the slot is double-checked
 *     for occupancy and compared with the key.
 *   - Each group has also an associated so-called insertion counter used for
 *     the following optimistic insertion algorithm:
 *     - The value of the insertion counter for the initial group in the probe
 *       sequence is locally recorded (let's call this value c0).
 *     - Lookup is as described above. If lookup finds no equivalent element,
 *       search for an available slot for insertion successively locks/unlocks
 *       each group in the probing sequence.
 *     - When an available slot is located, it is preemptively occupied (its
 *       reduced hash value is set) and the insertion counter is atomically
 *       incremented: if no other thread has incremented the counter during the
 *       whole operation (which is checked by comparing with c0), then we're
 *       good to go and complete the insertion, otherwise we roll back and start
 *       over.
 */

template <typename TypePolicy,typename Hash,typename Pred,typename Allocator>
using concurrent_table_core_impl=table_core<
  TypePolicy,group15<atomic_integral>,concurrent_table_arrays,
  atomic_size_control,Hash,Pred,Allocator>;

#include <boost/unordered/detail/foa/ignore_wshadow.hpp>

#if defined(BOOST_MSVC)
#pragma warning(push)
#pragma warning(disable:4714) /* marked as __forceinline not inlined */
#endif

template<typename TypePolicy,typename Hash,typename Pred,typename Allocator>
class concurrent_table:
  concurrent_table_core_impl<TypePolicy,Hash,Pred,Allocator>
{
  using super=concurrent_table_core_impl<TypePolicy,Hash,Pred,Allocator>;
  using type_policy=typename super::type_policy;
  using group_type=typename super::group_type;
  using super::N;
  using prober=typename super::prober;

  template<
    typename TypePolicy2,typename Hash2,typename Pred2,typename Allocator2>
  friend class concurrent_table;

public:
  using key_type=typename super::key_type;
  using init_type=typename super::init_type;
  using value_type=typename super::value_type;
  using element_type=typename super::element_type;
  using hasher=typename super::hasher;
  using key_equal=typename super::key_equal;
  using allocator_type=typename super::allocator_type;
  using size_type=typename super::size_type;

private:
  template<typename Value,typename T>
  using enable_if_is_value_type=typename std::enable_if<
    !std::is_same<init_type,value_type>::value&&
    std::is_same<Value,value_type>::value,
    T
  >::type;

public:
  concurrent_table(
    std::size_t n=default_bucket_count,const Hash& h_=Hash(),
    const Pred& pred_=Pred(),const Allocator& al_=Allocator()):
    super{n,h_,pred_,al_}
    {}

  concurrent_table(const concurrent_table& x):
    concurrent_table(x,x.exclusive_access()){}
  concurrent_table(concurrent_table&& x):
    concurrent_table(std::move(x),x.exclusive_access()){}
  concurrent_table(const concurrent_table& x,const Allocator& al_):
    concurrent_table(x,al_,x.exclusive_access()){}
  concurrent_table(concurrent_table&& x,const Allocator& al_):
    concurrent_table(std::move(x),al_,x.exclusive_access()){}
  ~concurrent_table()=default;

  concurrent_table& operator=(const concurrent_table& x)
  {
    auto lck=exclusive_access(*this,x);
    super::operator=(x);
    return *this;
  }

  concurrent_table& operator=(concurrent_table&& x)
  {
    auto lck=exclusive_access(*this,x);
    super::operator=(std::move(x));
    return *this;
  }

  concurrent_table& operator=(std::initializer_list<value_type> il) {
    auto lck=exclusive_access();
    super::clear();
    super::noshrink_reserve(il.size());
    for (auto const& v : il) {
      this->unprotected_emplace(v);
    }
    return *this;
  }

  allocator_type get_allocator()const noexcept
  {
    auto lck=shared_access();
    return super::get_allocator();
  }

  template<typename Key,typename F>
  BOOST_FORCEINLINE std::size_t visit(const Key& x,F&& f)
  {
    return visit_impl(group_exclusive{},x,std::forward<F>(f));
  }

  template<typename Key,typename F>
  BOOST_FORCEINLINE std::size_t visit(const Key& x,F&& f)const
  {
    return visit_impl(group_shared{},x,std::forward<F>(f));
  }

  template<typename Key,typename F>
  BOOST_FORCEINLINE std::size_t cvisit(const Key& x,F&& f)const
  {
    return visit(x,std::forward<F>(f));
  }

  template<typename F> std::size_t visit_all(F&& f)
  {
    return visit_all_impl(group_exclusive{},std::forward<F>(f));
  }

  template<typename F> std::size_t visit_all(F&& f)const
  {
    return visit_all_impl(group_shared{},std::forward<F>(f));
  }

  template<typename F> std::size_t cvisit_all(F&& f)const
  {
    return visit_all(std::forward<F>(f));
  }

#if defined(BOOST_UNORDERED_PARALLEL_ALGORITHMS)
  template<typename ExecutionPolicy,typename F>
  void visit_all(ExecutionPolicy&& policy,F&& f)
  {
    visit_all_impl(
      group_exclusive{},
      std::forward<ExecutionPolicy>(policy),std::forward<F>(f));
  }

  template<typename ExecutionPolicy,typename F>
  void visit_all(ExecutionPolicy&& policy,F&& f)const
  {
    visit_all_impl(
      group_shared{},
      std::forward<ExecutionPolicy>(policy),std::forward<F>(f));
  }

  template<typename ExecutionPolicy,typename F>
  void cvisit_all(ExecutionPolicy&& policy,F&& f)const
  {
    visit_all(std::forward<ExecutionPolicy>(policy),std::forward<F>(f));
  }
#endif

  bool empty()const noexcept{return size()==0;}
  
  std::size_t size()const noexcept
  {
    auto lck=shared_access();
    return unprotected_size();
  }

  using super::max_size; 

  template<typename... Args>
  BOOST_FORCEINLINE bool emplace(Args&&... args)
  {
    return construct_and_emplace(std::forward<Args>(args)...);
  }

  BOOST_FORCEINLINE bool
  insert(const init_type& x){return emplace_impl(x);}

  BOOST_FORCEINLINE bool
  insert(init_type&& x){return emplace_impl(std::move(x));}

  /* template<typename=void> tilts call ambiguities in favor of init_type */

  template<typename=void>
  BOOST_FORCEINLINE bool
  insert(const value_type& x){return emplace_impl(x);}
  
  template<typename=void>
  BOOST_FORCEINLINE bool
  insert(value_type&& x){return emplace_impl(std::move(x));}

  template<typename Key,typename... Args>
  BOOST_FORCEINLINE bool try_emplace(Key&& x,Args&&... args)
  {
    return emplace_impl(
      try_emplace_args_t{},std::forward<Key>(x),std::forward<Args>(args)...);
  }

  template<typename Key,typename... Args>
  BOOST_FORCEINLINE bool try_emplace_or_visit(Key&& x,Args&&... args)
  {
    return emplace_or_visit_flast(
      group_exclusive{},
      try_emplace_args_t{},std::forward<Key>(x),std::forward<Args>(args)...);
  }

  template<typename Key,typename... Args>
  BOOST_FORCEINLINE bool try_emplace_or_cvisit(Key&& x,Args&&... args)
  {
    return emplace_or_visit_flast(
      group_shared{},
      try_emplace_args_t{},std::forward<Key>(x),std::forward<Args>(args)...);
  }

  template<typename... Args>
  BOOST_FORCEINLINE bool emplace_or_visit(Args&&... args)
  {
    return construct_and_emplace_or_visit_flast(
      group_exclusive{},std::forward<Args>(args)...);
  }

  template<typename... Args>
  BOOST_FORCEINLINE bool emplace_or_cvisit(Args&&... args)
  {
    return construct_and_emplace_or_visit_flast(
      group_shared{},std::forward<Args>(args)...);
  }

  template<typename F>
  BOOST_FORCEINLINE bool insert_or_visit(const init_type& x,F&& f)
  {
    return emplace_or_visit_impl(group_exclusive{},std::forward<F>(f),x);
  }

  template<typename F>
  BOOST_FORCEINLINE bool insert_or_cvisit(const init_type& x,F&& f)
  {
    return emplace_or_visit_impl(group_shared{},std::forward<F>(f),x);
  }

  template<typename F>
  BOOST_FORCEINLINE bool insert_or_visit(init_type&& x,F&& f)
  {
    return emplace_or_visit_impl(
      group_exclusive{},std::forward<F>(f),std::move(x));
  }

  template<typename F>
  BOOST_FORCEINLINE bool insert_or_cvisit(init_type&& x,F&& f)
  {
    return emplace_or_visit_impl(
      group_shared{},std::forward<F>(f),std::move(x));
  }

  /* SFINAE tilts call ambiguities in favor of init_type */

  template<typename Value,typename F>
  BOOST_FORCEINLINE auto insert_or_visit(const Value& x,F&& f)
    ->enable_if_is_value_type<Value,bool>
  {
    return emplace_or_visit_impl(group_exclusive{},std::forward<F>(f),x);
  }

  template<typename Value,typename F>
  BOOST_FORCEINLINE auto insert_or_cvisit(const Value& x,F&& f)
    ->enable_if_is_value_type<Value,bool>
  {
    return emplace_or_visit_impl(group_shared{},std::forward<F>(f),x);
  }

  template<typename Value,typename F>
  BOOST_FORCEINLINE auto insert_or_visit(Value&& x,F&& f)
    ->enable_if_is_value_type<Value,bool>
  {
    return emplace_or_visit_impl(
      group_exclusive{},std::forward<F>(f),std::move(x));
  }

  template<typename Value,typename F>
  BOOST_FORCEINLINE auto insert_or_cvisit(Value&& x,F&& f)
    ->enable_if_is_value_type<Value,bool>
  {
    return emplace_or_visit_impl(
      group_shared{},std::forward<F>(f),std::move(x));
  }

  template<typename Key>
  BOOST_FORCEINLINE std::size_t erase(const Key& x)
  {
    return erase_if(x,[](const value_type&){return true;});
  }

  template<typename Key,typename F>
  BOOST_FORCEINLINE auto erase_if(const Key& x,F&& f)->typename std::enable_if<
    !is_execution_policy<Key>::value,std::size_t>::type
  {
    auto        lck=shared_access();
    auto        hash=this->hash_for(x);
    std::size_t res=0;
    unprotected_internal_visit(
      group_exclusive{},x,this->position_for(hash),hash,
      [&,this](group_type* pg,unsigned int n,element_type* p)
      {
        if(f(cast_for(group_exclusive{},type_policy::value_from(*p)))){
          super::erase(pg,n,p);
          res=1;
        }
      });
    return res;
  }

  template<typename F>
  std::size_t erase_if(F&& f)
  {
    auto        lck=shared_access();
    std::size_t res=0;
    for_all_elements(
      group_exclusive{},
      [&,this](group_type* pg,unsigned int n,element_type* p){
        if(f(cast_for(group_exclusive{},type_policy::value_from(*p)))){
          super::erase(pg,n,p);
          ++res;
        }
      });
    return res;
  }

#if defined(BOOST_UNORDERED_PARALLEL_ALGORITHMS)
  template<typename ExecutionPolicy,typename F>
  auto erase_if(ExecutionPolicy&& policy,F&& f)->typename std::enable_if<
    is_execution_policy<ExecutionPolicy>::value,void>::type
  {
    auto lck=shared_access();
    for_all_elements(
      group_exclusive{},std::forward<ExecutionPolicy>(policy),
      [&,this](group_type* pg,unsigned int n,element_type* p){
        if(f(cast_for(group_exclusive{},type_policy::value_from(*p)))){
          super::erase(pg,n,p);
        }
      });
  }
#endif

  void swap(concurrent_table& x)
    noexcept(noexcept(std::declval<super&>().swap(std::declval<super&>())))
  {
    auto lck=exclusive_access(*this,x);
    super::swap(x);
  }

  void clear()noexcept
  {
    auto lck=exclusive_access();
    super::clear();
  }

  // TODO: should we accept different allocator too?
  template<typename Hash2,typename Pred2>
  size_type merge(concurrent_table<TypePolicy,Hash2,Pred2,Allocator>& x)
  {
    using merge_table_type=concurrent_table<TypePolicy,Hash2,Pred2,Allocator>;
    using super2=typename merge_table_type::super;

    // for clang
    boost::ignore_unused<super2>();

    auto      lck=exclusive_access(*this,x);
    size_type s=super::size();
    x.super2::for_all_elements( /* super2::for_all_elements -> unprotected */
      [&,this](group_type* pg,unsigned int n,element_type* p){
        typename merge_table_type::erase_on_exit e{x,pg,n,p};
        if(!unprotected_emplace(type_policy::move(*p)))e.rollback();
      });
    return size_type{super::size()-s};
  }

  template<typename Hash2,typename Pred2>
  void merge(concurrent_table<TypePolicy,Hash2,Pred2,Allocator>&& x){merge(x);}

  hasher hash_function()const
  {
    auto lck=shared_access();
    return super::hash_function();
  }

  key_equal key_eq()const
  {
    auto lck=shared_access();
    return super::key_eq();
  }

  template<typename Key>
  BOOST_FORCEINLINE std::size_t count(Key&& x)const
  {
    return (std::size_t)contains(std::forward<Key>(x));
  }

  template<typename Key>
  BOOST_FORCEINLINE bool contains(Key&& x)const
  {
    return visit(std::forward<Key>(x),[](const value_type&){})!=0;
  }

  std::size_t capacity()const noexcept
  {
    auto lck=shared_access();
    return super::capacity();
  }

  float load_factor()const noexcept
  {
    auto lck=shared_access();
    if(super::capacity()==0)return 0;
    else                    return float(unprotected_size())/
                                   float(super::capacity());
  }

  using super::max_load_factor;

  std::size_t max_load()const noexcept
  {
    auto lck=shared_access();
    return super::max_load();
  }

  void rehash(std::size_t n)
  {
    auto lck=exclusive_access();
    super::rehash(n);
  }

  void reserve(std::size_t n)
  {
    auto lck=exclusive_access();
    super::reserve(n);
  }

  template<typename Predicate>
  friend std::size_t erase_if(concurrent_table& x,Predicate&& pr)
  {
    return x.erase_if(std::forward<Predicate>(pr));
  }

  friend bool operator==(const concurrent_table& x,const concurrent_table& y)
  {
    auto lck=exclusive_access(x,y);
    return static_cast<const super&>(x)==static_cast<const super&>(y);
  }

  friend bool operator!=(const concurrent_table& x,const concurrent_table& y)
  {
    return !(x==y);
  }

private:
  using mutex_type=rw_spinlock;
  using multimutex_type=multimutex<mutex_type,128>; // TODO: adapt 128 to the machine
  using shared_lock_guard=shared_lock<mutex_type>;
  using exclusive_lock_guard=lock_guard<multimutex_type>;
  using exclusive_bilock_guard=scoped_bilock<multimutex_type>;
  using group_shared_lock_guard=typename group_access::shared_lock_guard;
  using group_exclusive_lock_guard=typename group_access::exclusive_lock_guard;
  using group_insert_counter_type=typename group_access::insert_counter_type;

  concurrent_table(const concurrent_table& x,exclusive_lock_guard):
    super{x}{}
  concurrent_table(concurrent_table&& x,exclusive_lock_guard):
    super{std::move(x)}{}
  concurrent_table(
    const concurrent_table& x,const Allocator& al_,exclusive_lock_guard):
    super{x,al_}{}
  concurrent_table(
    concurrent_table&& x,const Allocator& al_,exclusive_lock_guard):
    super{std::move(x),al_}{}

  inline shared_lock_guard shared_access()const
  {
    thread_local auto id=(++thread_counter)%mutexes.size();

    return shared_lock_guard{mutexes[id]};
  }

  inline exclusive_lock_guard exclusive_access()const
  {
    return exclusive_lock_guard{mutexes};
  }

  static inline exclusive_bilock_guard exclusive_access(
    const concurrent_table& x,const concurrent_table& y)
  {
    return {x.mutexes,y.mutexes};
  }

  template<typename Hash2,typename Pred2>
  static inline exclusive_bilock_guard exclusive_access(
    const concurrent_table& x,
    const concurrent_table<TypePolicy,Hash2,Pred2,Allocator>& y)
  {
    return {x.mutexes,y.mutexes};
  }

  /* Tag-dispatched shared/exclusive group access */

  using group_shared=std::false_type;
  using group_exclusive=std::true_type;

  inline group_shared_lock_guard access(group_shared,std::size_t pos)const
  {
    return this->arrays.group_accesses[pos].shared_access();
  }

  inline group_exclusive_lock_guard access(
    group_exclusive,std::size_t pos)const
  {
    return this->arrays.group_accesses[pos].exclusive_access();
  }

  inline group_insert_counter_type& insert_counter(std::size_t pos)const
  {
    return this->arrays.group_accesses[pos].insert_counter();
  }

  /* Const casts value_type& according to the level of group access for
   * safe passing to visitation functions. When type_policy is set-like,
   * access is always const regardless of group access.
   */

  static inline const value_type&
  cast_for(group_shared,value_type& x){return x;}

  static inline typename std::conditional<
    std::is_same<key_type,value_type>::value,
    const value_type&,
    value_type&
  >::type
  cast_for(group_exclusive,value_type& x){return x;}

  struct erase_on_exit
  {
    erase_on_exit(
      concurrent_table& x_,
      group_type* pg_,unsigned int pos_,element_type* p_):
      x{x_},pg{pg_},pos{pos_},p{p_}{}
    ~erase_on_exit(){if(!rollback_)x.super::erase(pg,pos,p);}

    void rollback(){rollback_=true;}

    concurrent_table &x;
    group_type       *pg;
    unsigned  int     pos;
    element_type     *p;
    bool              rollback_=false;
  };

  template<typename GroupAccessMode,typename Key,typename F>
  BOOST_FORCEINLINE std::size_t visit_impl(
    GroupAccessMode access_mode,const Key& x,F&& f)const
  {
    auto lck=shared_access();
    auto hash=this->hash_for(x);
    return unprotected_visit(
      access_mode,x,this->position_for(hash),hash,std::forward<F>(f));
  }

  template<typename GroupAccessMode,typename F>
  std::size_t visit_all_impl(GroupAccessMode access_mode,F&& f)const
  {
    auto lck=shared_access();
    std::size_t res=0;
    for_all_elements(access_mode,[&](element_type* p){
      f(cast_for(access_mode,type_policy::value_from(*p)));
      ++res;
    });
    return res;
  }

#if defined(BOOST_UNORDERED_PARALLEL_ALGORITHMS)
  template<typename GroupAccessMode,typename ExecutionPolicy,typename F>
  void visit_all_impl(
    GroupAccessMode access_mode,ExecutionPolicy&& policy,F&& f)const
  {
    auto lck=shared_access();
    for_all_elements(
      access_mode,std::forward<ExecutionPolicy>(policy),
      [&](element_type* p){
        f(cast_for(access_mode,type_policy::value_from(*p)));
      });
  }
#endif

  template<typename GroupAccessMode,typename Key,typename F>
  BOOST_FORCEINLINE std::size_t unprotected_visit(
    GroupAccessMode access_mode,
    const Key& x,std::size_t pos0,std::size_t hash,F&& f)const
  {
    return unprotected_internal_visit(
      access_mode,x,pos0,hash,
      [&](group_type*,unsigned int,element_type* p)
        {f(cast_for(access_mode,type_policy::value_from(*p)));});
  }

#if defined(BOOST_MSVC)
/* warning: forcing value to bool 'true' or 'false' in bool(pred()...) */
#pragma warning(push)
#pragma warning(disable:4800)
#endif

  template<typename GroupAccessMode,typename Key,typename F>
  BOOST_FORCEINLINE std::size_t unprotected_internal_visit(
    GroupAccessMode access_mode,
    const Key& x,std::size_t pos0,std::size_t hash,F&& f)const
  {    
    prober pb(pos0);
    do{
      auto pos=pb.get();
      auto pg=this->arrays.groups+pos;
      auto mask=pg->match(hash);
      if(mask){
        auto p=this->arrays.elements+pos*N;
        BOOST_UNORDERED_PREFETCH_ELEMENTS(p,N);
        auto lck=access(access_mode,pos);
        do{
          auto n=unchecked_countr_zero(mask);
          if(BOOST_LIKELY(
            pg->is_occupied(n)&&bool(this->pred()(x,this->key_from(p[n]))))){
            f(pg,n,p+n);
            return 1;
          }
          mask&=mask-1;
        }while(mask);
      }
      if(BOOST_LIKELY(pg->is_not_overflowed(hash))){
        return 0;
      }
    }
    while(BOOST_LIKELY(pb.next(this->arrays.groups_size_mask)));
    return 0;
  }

#if defined(BOOST_MSVC)
#pragma warning(pop) /* C4800 */
#endif

  std::size_t unprotected_size()const
  {
    std::size_t m=this->size_ctrl.ml;
    std::size_t s=this->size_ctrl.size;
    return s<=m?s:m;
  }

  template<typename... Args>
  BOOST_FORCEINLINE bool construct_and_emplace(Args&&... args)
  {
    return construct_and_emplace_or_visit(
      group_shared{},[](const value_type&){},std::forward<Args>(args)...);
  }

  struct call_construct_and_emplace_or_visit
  {
    template<typename... Args>
    BOOST_FORCEINLINE bool operator()(
      concurrent_table* this_,Args&&... args)const
    {
      return this_->construct_and_emplace_or_visit(
        std::forward<Args>(args)...);
    }
  };

  template<typename GroupAccessMode,typename... Args>
  BOOST_FORCEINLINE bool construct_and_emplace_or_visit_flast(
    GroupAccessMode access_mode,Args&&... args)
  {
    return mp11::tuple_apply(
      call_construct_and_emplace_or_visit{},
      std::tuple_cat(
        std::make_tuple(this,access_mode),
        tuple_rotate_right(std::forward_as_tuple(std::forward<Args>(args)...))
      )
    );
  }

  template<typename GroupAccessMode,typename F,typename... Args>
  BOOST_FORCEINLINE bool construct_and_emplace_or_visit(
    GroupAccessMode access_mode,F&& f,Args&&... args)
  {
    auto lck=shared_access();

    auto x=alloc_make_insert_type<type_policy>(
      this->al(),std::forward<Args>(args)...);
    int res=unprotected_norehash_emplace_or_visit(
      access_mode,std::forward<F>(f),type_policy::move(x.value()));
    if(BOOST_LIKELY(res>=0))return res!=0;

    lck.unlock();

    rehash_if_full();
    return noinline_emplace_or_visit(
      access_mode,std::forward<F>(f),type_policy::move(x.value()));
  }

  template<typename... Args>
  BOOST_FORCEINLINE bool emplace_impl(Args&&... args)
  {
    return emplace_or_visit_impl(
      group_shared{},[](const value_type&){},std::forward<Args>(args)...);
  }

  template<typename GroupAccessMode,typename F,typename... Args>
  BOOST_NOINLINE bool noinline_emplace_or_visit(
    GroupAccessMode access_mode,F&& f,Args&&... args)
  {
    return emplace_or_visit_impl(
      access_mode,std::forward<F>(f),std::forward<Args>(args)...);
  }

  struct call_emplace_or_visit_impl
  {
    template<typename... Args>
    BOOST_FORCEINLINE bool operator()(
      concurrent_table* this_,Args&&... args)const
    {
      return this_->emplace_or_visit_impl(std::forward<Args>(args)...);
    }
  };

  template<typename GroupAccessMode,typename... Args>
  BOOST_FORCEINLINE bool emplace_or_visit_flast(
    GroupAccessMode access_mode,Args&&... args)
  {
    return mp11::tuple_apply(
      call_emplace_or_visit_impl{},
      std::tuple_cat(
        std::make_tuple(this,access_mode),
        tuple_rotate_right(std::forward_as_tuple(std::forward<Args>(args)...))
      )
    );
  }

  template<typename GroupAccessMode,typename F,typename... Args>
  BOOST_FORCEINLINE bool emplace_or_visit_impl(
    GroupAccessMode access_mode,F&& f,Args&&... args)
  {
    for(;;){
      {
        auto lck=shared_access();
        int res=unprotected_norehash_emplace_or_visit(
          access_mode,std::forward<F>(f),std::forward<Args>(args)...);
        if(BOOST_LIKELY(res>=0))return res!=0;
      }
      rehash_if_full();
    }
  }

  template<typename... Args>
  BOOST_FORCEINLINE bool unprotected_emplace(Args&&... args)
  {
    const auto &k=this->key_from(std::forward<Args>(args)...);
    auto        hash=this->hash_for(k);
    auto        pos0=this->position_for(hash);

    if(this->find(k,pos0,hash))return false;

    if(BOOST_LIKELY(this->size_ctrl.size<this->size_ctrl.ml)){
      this->unchecked_emplace_at(pos0,hash,std::forward<Args>(args)...);
    }
    else{
      this->unchecked_emplace_with_rehash(hash,std::forward<Args>(args)...);
    }
    return true;
  }

  struct reserve_size
  {
    reserve_size(concurrent_table& x_):x{x_}
    {
      size_=++x.size_ctrl.size;
    }

    ~reserve_size()
    {
      if(!commit_)--x.size_ctrl.size;
    }

    bool succeeded()const{return size_<=x.size_ctrl.ml;}

    void commit(){commit_=true;}

    concurrent_table &x;
    std::size_t       size_;
    bool              commit_=false;
  };

  struct reserve_slot
  {
    reserve_slot(group_type* pg_,std::size_t pos_,std::size_t hash):
      pg{pg_},pos{pos_}
    {
      pg->set(pos,hash);
    }

    ~reserve_slot()
    {
      if(!commit_)pg->reset(pos);
    }

    void commit(){commit_=true;}

    group_type  *pg;
    std::size_t pos;
    bool        commit_=false;
  };

  template<typename GroupAccessMode,typename F,typename... Args>
  BOOST_FORCEINLINE int
  unprotected_norehash_emplace_or_visit(
    GroupAccessMode access_mode,F&& f,Args&&... args)
  {
    const auto &k=this->key_from(std::forward<Args>(args)...);
    auto        hash=this->hash_for(k);
    auto        pos0=this->position_for(hash);

    for(;;){
    startover:
      boost::uint32_t counter=insert_counter(pos0);
      if(unprotected_visit(
        access_mode,k,pos0,hash,std::forward<F>(f)))return 0;

      reserve_size rsize(*this);
      if(BOOST_LIKELY(rsize.succeeded())){
        for(prober pb(pos0);;pb.next(this->arrays.groups_size_mask)){
          auto pos=pb.get();
          auto pg=this->arrays.groups+pos;
          auto lck=access(group_exclusive{},pos);
          auto mask=pg->match_available();
          if(BOOST_LIKELY(mask!=0)){
            auto n=unchecked_countr_zero(mask);
            reserve_slot rslot{pg,n,hash};
            if(BOOST_UNLIKELY(insert_counter(pos0)++!=counter)){
              /* other thread inserted from pos0, need to start over */
              goto startover;
            }
            auto p=this->arrays.elements+pos*N+n;
            this->construct_element(p,std::forward<Args>(args)...);
            rslot.commit();
            rsize.commit();
            return 1;
          }
          pg->mark_overflow(hash);
        }
      }
      else return -1;
    }
  }

  void rehash_if_full()
  {
    auto lck=exclusive_access();
    if(this->size_ctrl.size==this->size_ctrl.ml){
      this->unchecked_rehash_for_growth();
    }
  }

  template<typename GroupAccessMode,typename F>
  auto for_all_elements(GroupAccessMode access_mode,F f)const
    ->decltype(f(nullptr),void())
  {
    for_all_elements(
      access_mode,[&](group_type*,unsigned int,element_type* p){f(p);});
  }

  template<typename GroupAccessMode,typename F>
  auto for_all_elements(GroupAccessMode access_mode,F f)const
    ->decltype(f(nullptr,0,nullptr),void())
  {
    auto p=this->arrays.elements;
    if(!p)return;
    for(auto pg=this->arrays.groups,last=pg+this->arrays.groups_size_mask+1;
        pg!=last;++pg,p+=N){
      auto lck=access(access_mode,(std::size_t)(pg-this->arrays.groups));
      auto mask=this->match_really_occupied(pg,last);
      while(mask){
        auto n=unchecked_countr_zero(mask);
        f(pg,n,p+n);
        mask&=mask-1;
      }
    }
  }

#if defined(BOOST_UNORDERED_PARALLEL_ALGORITHMS)
  template<typename GroupAccessMode,typename ExecutionPolicy,typename F>
  auto for_all_elements(
    GroupAccessMode access_mode,ExecutionPolicy&& policy,F f)const
    ->decltype(f(nullptr),void())
  {
    for_all_elements(
      access_mode,std::forward<ExecutionPolicy>(policy),
      [&](group_type*,unsigned int,element_type* p){f(p);});
  }

  template<typename GroupAccessMode,typename ExecutionPolicy,typename F>
  auto for_all_elements(
    GroupAccessMode access_mode,ExecutionPolicy&& policy,F f)const
    ->decltype(f(nullptr,0,nullptr),void())
  {
    if(!this->arrays.elements)return;
    auto first=this->arrays.groups,
         last=first+this->arrays.groups_size_mask+1;
    std::for_each(std::forward<ExecutionPolicy>(policy),first,last,
      [&,this](group_type& g){
        std::size_t pos=static_cast<std::size_t>(&g-first);
        auto        p=this->arrays.elements+pos*N;
        auto        lck=access(access_mode,pos);
        auto        mask=this->match_really_occupied(&g,last);
        while(mask){
          auto n=unchecked_countr_zero(mask);
          f(&g,n,p+n);
          mask&=mask-1;
        }
      }
    );
  }
#endif

  static std::atomic<std::size_t> thread_counter;
  mutable multimutex_type         mutexes;
};

template<typename T,typename H,typename P,typename A>
std::atomic<std::size_t> concurrent_table<T,H,P,A>::thread_counter={};

#if defined(BOOST_MSVC)
#pragma warning(pop) /* C4714 */
#endif

#include <boost/unordered/detail/foa/restore_wshadow.hpp>

} /* namespace foa */
} /* namespace detail */
} /* namespace unordered */
} /* namespace boost */

#endif
