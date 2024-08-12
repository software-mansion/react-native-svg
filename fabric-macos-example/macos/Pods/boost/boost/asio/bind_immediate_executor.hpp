//
// bind_immediate_executor.hpp
// ~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Copyright (c) 2003-2023 Christopher M. Kohlhoff (chris at kohlhoff dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_ASIO_BIND_IMMEDIATE_EXECUTOR_HPP
#define BOOST_ASIO_BIND_IMMEDIATE_EXECUTOR_HPP

#if defined(_MSC_VER) && (_MSC_VER >= 1200)
# pragma once
#endif // defined(_MSC_VER) && (_MSC_VER >= 1200)

#include <boost/asio/detail/config.hpp>
#include <boost/asio/detail/type_traits.hpp>
#include <boost/asio/detail/variadic_templates.hpp>
#include <boost/asio/associated_immediate_executor.hpp>
#include <boost/asio/associator.hpp>
#include <boost/asio/async_result.hpp>

#include <boost/asio/detail/push_options.hpp>

namespace boost {
namespace asio {
namespace detail {

// Helper to automatically define nested typedef result_type.

template <typename T, typename = void>
struct immediate_executor_binder_result_type
{
protected:
  typedef void result_type_or_void;
};

template <typename T>
struct immediate_executor_binder_result_type<T,
  typename void_type<typename T::result_type>::type>
{
  typedef typename T::result_type result_type;
protected:
  typedef result_type result_type_or_void;
};

template <typename R>
struct immediate_executor_binder_result_type<R(*)()>
{
  typedef R result_type;
protected:
  typedef result_type result_type_or_void;
};

template <typename R>
struct immediate_executor_binder_result_type<R(&)()>
{
  typedef R result_type;
protected:
  typedef result_type result_type_or_void;
};

template <typename R, typename A1>
struct immediate_executor_binder_result_type<R(*)(A1)>
{
  typedef R result_type;
protected:
  typedef result_type result_type_or_void;
};

template <typename R, typename A1>
struct immediate_executor_binder_result_type<R(&)(A1)>
{
  typedef R result_type;
protected:
  typedef result_type result_type_or_void;
};

template <typename R, typename A1, typename A2>
struct immediate_executor_binder_result_type<R(*)(A1, A2)>
{
  typedef R result_type;
protected:
  typedef result_type result_type_or_void;
};

template <typename R, typename A1, typename A2>
struct immediate_executor_binder_result_type<R(&)(A1, A2)>
{
  typedef R result_type;
protected:
  typedef result_type result_type_or_void;
};

// Helper to automatically define nested typedef argument_type.

template <typename T, typename = void>
struct immediate_executor_binder_argument_type {};

template <typename T>
struct immediate_executor_binder_argument_type<T,
  typename void_type<typename T::argument_type>::type>
{
  typedef typename T::argument_type argument_type;
};

template <typename R, typename A1>
struct immediate_executor_binder_argument_type<R(*)(A1)>
{
  typedef A1 argument_type;
};

template <typename R, typename A1>
struct immediate_executor_binder_argument_type<R(&)(A1)>
{
  typedef A1 argument_type;
};

// Helper to automatically define nested typedefs first_argument_type and
// second_argument_type.

template <typename T, typename = void>
struct immediate_executor_binder_argument_types {};

template <typename T>
struct immediate_executor_binder_argument_types<T,
  typename void_type<typename T::first_argument_type>::type>
{
  typedef typename T::first_argument_type first_argument_type;
  typedef typename T::second_argument_type second_argument_type;
};

template <typename R, typename A1, typename A2>
struct immediate_executor_binder_argument_type<R(*)(A1, A2)>
{
  typedef A1 first_argument_type;
  typedef A2 second_argument_type;
};

template <typename R, typename A1, typename A2>
struct immediate_executor_binder_argument_type<R(&)(A1, A2)>
{
  typedef A1 first_argument_type;
  typedef A2 second_argument_type;
};

// Helper to enable SFINAE on zero-argument operator() below.

template <typename T, typename = void>
struct immediate_executor_binder_result_of0
{
  typedef void type;
};

template <typename T>
struct immediate_executor_binder_result_of0<T,
  typename void_type<typename result_of<T()>::type>::type>
{
  typedef typename result_of<T()>::type type;
};

} // namespace detail

/// A call wrapper type to bind a immediate executor of type @c Executor
/// to an object of type @c T.
template <typename T, typename Executor>
class immediate_executor_binder
#if !defined(GENERATING_DOCUMENTATION)
  : public detail::immediate_executor_binder_result_type<T>,
    public detail::immediate_executor_binder_argument_type<T>,
    public detail::immediate_executor_binder_argument_types<T>
#endif // !defined(GENERATING_DOCUMENTATION)
{
public:
  /// The type of the target object.
  typedef T target_type;

  /// The type of the associated immediate executor.
  typedef Executor immediate_executor_type;

#if defined(GENERATING_DOCUMENTATION)
  /// The return type if a function.
  /**
   * The type of @c result_type is based on the type @c T of the wrapper's
   * target object:
   *
   * @li if @c T is a pointer to function type, @c result_type is a synonym for
   * the return type of @c T;
   *
   * @li if @c T is a class type with a member type @c result_type, then @c
   * result_type is a synonym for @c T::result_type;
   *
   * @li otherwise @c result_type is not defined.
   */
  typedef see_below result_type;

  /// The type of the function's argument.
  /**
   * The type of @c argument_type is based on the type @c T of the wrapper's
   * target object:
   *
   * @li if @c T is a pointer to a function type accepting a single argument,
   * @c argument_type is a synonym for the return type of @c T;
   *
   * @li if @c T is a class type with a member type @c argument_type, then @c
   * argument_type is a synonym for @c T::argument_type;
   *
   * @li otherwise @c argument_type is not defined.
   */
  typedef see_below argument_type;

  /// The type of the function's first argument.
  /**
   * The type of @c first_argument_type is based on the type @c T of the
   * wrapper's target object:
   *
   * @li if @c T is a pointer to a function type accepting two arguments, @c
   * first_argument_type is a synonym for the return type of @c T;
   *
   * @li if @c T is a class type with a member type @c first_argument_type,
   * then @c first_argument_type is a synonym for @c T::first_argument_type;
   *
   * @li otherwise @c first_argument_type is not defined.
   */
  typedef see_below first_argument_type;

  /// The type of the function's second argument.
  /**
   * The type of @c second_argument_type is based on the type @c T of the
   * wrapper's target object:
   *
   * @li if @c T is a pointer to a function type accepting two arguments, @c
   * second_argument_type is a synonym for the return type of @c T;
   *
   * @li if @c T is a class type with a member type @c first_argument_type,
   * then @c second_argument_type is a synonym for @c T::second_argument_type;
   *
   * @li otherwise @c second_argument_type is not defined.
   */
  typedef see_below second_argument_type;
#endif // defined(GENERATING_DOCUMENTATION)

  /// Construct a immediate executor wrapper for the specified object.
  /**
   * This constructor is only valid if the type @c T is constructible from type
   * @c U.
   */
  template <typename U>
  immediate_executor_binder(const immediate_executor_type& e,
      BOOST_ASIO_MOVE_ARG(U) u)
    : executor_(e),
      target_(BOOST_ASIO_MOVE_CAST(U)(u))
  {
  }

  /// Copy constructor.
  immediate_executor_binder(const immediate_executor_binder& other)
    : executor_(other.get_immediate_executor()),
      target_(other.get())
  {
  }

  /// Construct a copy, but specify a different immediate executor.
  immediate_executor_binder(const immediate_executor_type& e,
      const immediate_executor_binder& other)
    : executor_(e),
      target_(other.get())
  {
  }

  /// Construct a copy of a different immediate executor wrapper type.
  /**
   * This constructor is only valid if the @c Executor type is
   * constructible from type @c OtherExecutor, and the type @c T is
   * constructible from type @c U.
   */
  template <typename U, typename OtherExecutor>
  immediate_executor_binder(
      const immediate_executor_binder<U, OtherExecutor>& other)
    : executor_(other.get_immediate_executor()),
      target_(other.get())
  {
  }

  /// Construct a copy of a different immediate executor wrapper type, but
  /// specify a different immediate executor.
  /**
   * This constructor is only valid if the type @c T is constructible from type
   * @c U.
   */
  template <typename U, typename OtherExecutor>
  immediate_executor_binder(const immediate_executor_type& e,
      const immediate_executor_binder<U, OtherExecutor>& other)
    : executor_(e),
      target_(other.get())
  {
  }

#if defined(BOOST_ASIO_HAS_MOVE) || defined(GENERATING_DOCUMENTATION)

  /// Move constructor.
  immediate_executor_binder(immediate_executor_binder&& other)
    : executor_(BOOST_ASIO_MOVE_CAST(immediate_executor_type)(
          other.get_immediate_executor())),
      target_(BOOST_ASIO_MOVE_CAST(T)(other.get()))
  {
  }

  /// Move construct the target object, but specify a different immediate
  /// executor.
  immediate_executor_binder(const immediate_executor_type& e,
      immediate_executor_binder&& other)
    : executor_(e),
      target_(BOOST_ASIO_MOVE_CAST(T)(other.get()))
  {
  }

  /// Move construct from a different immediate executor wrapper type.
  template <typename U, typename OtherExecutor>
  immediate_executor_binder(
      immediate_executor_binder<U, OtherExecutor>&& other)
    : executor_(BOOST_ASIO_MOVE_CAST(OtherExecutor)(
          other.get_immediate_executor())),
      target_(BOOST_ASIO_MOVE_CAST(U)(other.get()))
  {
  }

  /// Move construct from a different immediate executor wrapper type, but
  /// specify a different immediate executor.
  template <typename U, typename OtherExecutor>
  immediate_executor_binder(const immediate_executor_type& e,
      immediate_executor_binder<U, OtherExecutor>&& other)
    : executor_(e),
      target_(BOOST_ASIO_MOVE_CAST(U)(other.get()))
  {
  }

#endif // defined(BOOST_ASIO_HAS_MOVE) || defined(GENERATING_DOCUMENTATION)

  /// Destructor.
  ~immediate_executor_binder()
  {
  }

  /// Obtain a reference to the target object.
  target_type& get() BOOST_ASIO_NOEXCEPT
  {
    return target_;
  }

  /// Obtain a reference to the target object.
  const target_type& get() const BOOST_ASIO_NOEXCEPT
  {
    return target_;
  }

  /// Obtain the associated immediate executor.
  immediate_executor_type get_immediate_executor() const BOOST_ASIO_NOEXCEPT
  {
    return executor_;
  }

#if defined(GENERATING_DOCUMENTATION)

  template <typename... Args> auto operator()(Args&& ...);
  template <typename... Args> auto operator()(Args&& ...) const;

#elif defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

  /// Forwarding function call operator.
  template <typename... Args>
  typename result_of<T(Args...)>::type operator()(
      BOOST_ASIO_MOVE_ARG(Args)... args)
  {
    return target_(BOOST_ASIO_MOVE_CAST(Args)(args)...);
  }

  /// Forwarding function call operator.
  template <typename... Args>
  typename result_of<T(Args...)>::type operator()(
      BOOST_ASIO_MOVE_ARG(Args)... args) const
  {
    return target_(BOOST_ASIO_MOVE_CAST(Args)(args)...);
  }

#elif defined(BOOST_ASIO_HAS_STD_TYPE_TRAITS) && !defined(_MSC_VER)

  typename detail::immediate_executor_binder_result_of0<T>::type operator()()
  {
    return target_();
  }

  typename detail::immediate_executor_binder_result_of0<T>::type
  operator()() const
  {
    return target_();
  }

#define BOOST_ASIO_PRIVATE_BINDER_CALL_DEF(n) \
  template <BOOST_ASIO_VARIADIC_TPARAMS(n)> \
  typename result_of<T(BOOST_ASIO_VARIADIC_TARGS(n))>::type operator()( \
      BOOST_ASIO_VARIADIC_MOVE_PARAMS(n)) \
  { \
    return target_(BOOST_ASIO_VARIADIC_MOVE_ARGS(n)); \
  } \
  \
  template <BOOST_ASIO_VARIADIC_TPARAMS(n)> \
  typename result_of<T(BOOST_ASIO_VARIADIC_TARGS(n))>::type operator()( \
      BOOST_ASIO_VARIADIC_MOVE_PARAMS(n)) const \
  { \
    return target_(BOOST_ASIO_VARIADIC_MOVE_ARGS(n)); \
  } \
  /**/
  BOOST_ASIO_VARIADIC_GENERATE(BOOST_ASIO_PRIVATE_BINDER_CALL_DEF)
#undef BOOST_ASIO_PRIVATE_BINDER_CALL_DEF

#else // defined(BOOST_ASIO_HAS_STD_TYPE_TRAITS) && !defined(_MSC_VER)

  typedef typename detail::immediate_executor_binder_result_type<
    T>::result_type_or_void result_type_or_void;

  result_type_or_void operator()()
  {
    return target_();
  }

  result_type_or_void operator()() const
  {
    return target_();
  }

#define BOOST_ASIO_PRIVATE_BINDER_CALL_DEF(n) \
  template <BOOST_ASIO_VARIADIC_TPARAMS(n)> \
  result_type_or_void operator()( \
      BOOST_ASIO_VARIADIC_MOVE_PARAMS(n)) \
  { \
    return target_(BOOST_ASIO_VARIADIC_MOVE_ARGS(n)); \
  } \
  \
  template <BOOST_ASIO_VARIADIC_TPARAMS(n)> \
  result_type_or_void operator()( \
      BOOST_ASIO_VARIADIC_MOVE_PARAMS(n)) const \
  { \
    return target_(BOOST_ASIO_VARIADIC_MOVE_ARGS(n)); \
  } \
  /**/
  BOOST_ASIO_VARIADIC_GENERATE(BOOST_ASIO_PRIVATE_BINDER_CALL_DEF)
#undef BOOST_ASIO_PRIVATE_BINDER_CALL_DEF

#endif // defined(BOOST_ASIO_HAS_STD_TYPE_TRAITS) && !defined(_MSC_VER)

private:
  Executor executor_;
  T target_;
};

/// Associate an object of type @c T with a immediate executor of type
/// @c Executor.
template <typename Executor, typename T>
BOOST_ASIO_NODISCARD inline
immediate_executor_binder<typename decay<T>::type, Executor>
bind_immediate_executor(const Executor& e, BOOST_ASIO_MOVE_ARG(T) t)
{
  return immediate_executor_binder<
    typename decay<T>::type, Executor>(
      e, BOOST_ASIO_MOVE_CAST(T)(t));
}

#if !defined(GENERATING_DOCUMENTATION)

namespace detail {

template <typename TargetAsyncResult, typename Executor, typename = void>
class immediate_executor_binder_completion_handler_async_result
{
public:
  template <typename T>
  explicit immediate_executor_binder_completion_handler_async_result(T&)
  {
  }
};

template <typename TargetAsyncResult, typename Executor>
class immediate_executor_binder_completion_handler_async_result<
  TargetAsyncResult, Executor,
  typename void_type<
    typename TargetAsyncResult::completion_handler_type
  >::type>
{
public:
  typedef immediate_executor_binder<
    typename TargetAsyncResult::completion_handler_type, Executor>
      completion_handler_type;

  explicit immediate_executor_binder_completion_handler_async_result(
      typename TargetAsyncResult::completion_handler_type& handler)
    : target_(handler)
  {
  }

  typename TargetAsyncResult::return_type get()
  {
    return target_.get();
  }

private:
  TargetAsyncResult target_;
};

template <typename TargetAsyncResult, typename = void>
struct immediate_executor_binder_async_result_return_type
{
};

template <typename TargetAsyncResult>
struct immediate_executor_binder_async_result_return_type<
  TargetAsyncResult,
  typename void_type<
    typename TargetAsyncResult::return_type
  >::type>
{
  typedef typename TargetAsyncResult::return_type return_type;
};

} // namespace detail

template <typename T, typename Executor, typename Signature>
class async_result<immediate_executor_binder<T, Executor>, Signature> :
  public detail::immediate_executor_binder_completion_handler_async_result<
    async_result<T, Signature>, Executor>,
  public detail::immediate_executor_binder_async_result_return_type<
    async_result<T, Signature> >
{
public:
  explicit async_result(immediate_executor_binder<T, Executor>& b)
    : detail::immediate_executor_binder_completion_handler_async_result<
        async_result<T, Signature>, Executor>(b.get())
  {
  }

  template <typename Initiation>
  struct init_wrapper
  {
    template <typename Init>
    init_wrapper(const Executor& e, BOOST_ASIO_MOVE_ARG(Init) init)
      : executor_(e),
        initiation_(BOOST_ASIO_MOVE_CAST(Init)(init))
    {
    }

#if defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

    template <typename Handler, typename... Args>
    void operator()(
        BOOST_ASIO_MOVE_ARG(Handler) handler,
        BOOST_ASIO_MOVE_ARG(Args)... args)
    {
      BOOST_ASIO_MOVE_CAST(Initiation)(initiation_)(
          immediate_executor_binder<
            typename decay<Handler>::type, Executor>(
              executor_, BOOST_ASIO_MOVE_CAST(Handler)(handler)),
          BOOST_ASIO_MOVE_CAST(Args)(args)...);
    }

    template <typename Handler, typename... Args>
    void operator()(
        BOOST_ASIO_MOVE_ARG(Handler) handler,
        BOOST_ASIO_MOVE_ARG(Args)... args) const
    {
      initiation_(
          immediate_executor_binder<
            typename decay<Handler>::type, Executor>(
              executor_, BOOST_ASIO_MOVE_CAST(Handler)(handler)),
          BOOST_ASIO_MOVE_CAST(Args)(args)...);
    }

#else // defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

    template <typename Handler>
    void operator()(
        BOOST_ASIO_MOVE_ARG(Handler) handler)
    {
      BOOST_ASIO_MOVE_CAST(Initiation)(initiation_)(
          immediate_executor_binder<
            typename decay<Handler>::type, Executor>(
              executor_, BOOST_ASIO_MOVE_CAST(Handler)(handler)));
    }

    template <typename Handler>
    void operator()(
        BOOST_ASIO_MOVE_ARG(Handler) handler) const
    {
      initiation_(
          immediate_executor_binder<
            typename decay<Handler>::type, Executor>(
              executor_, BOOST_ASIO_MOVE_CAST(Handler)(handler)));
    }

#define BOOST_ASIO_PRIVATE_INIT_WRAPPER_DEF(n) \
    template <typename Handler, BOOST_ASIO_VARIADIC_TPARAMS(n)> \
    void operator()( \
        BOOST_ASIO_MOVE_ARG(Handler) handler, \
        BOOST_ASIO_VARIADIC_MOVE_PARAMS(n)) \
    { \
      BOOST_ASIO_MOVE_CAST(Initiation)(initiation_)( \
          immediate_executor_binder< \
            typename decay<Handler>::type, Executor>( \
              executor_, BOOST_ASIO_MOVE_CAST(Handler)(handler)), \
          BOOST_ASIO_VARIADIC_MOVE_ARGS(n)); \
    } \
    \
    template <typename Handler, BOOST_ASIO_VARIADIC_TPARAMS(n)> \
    void operator()( \
        BOOST_ASIO_MOVE_ARG(Handler) handler, \
        BOOST_ASIO_VARIADIC_MOVE_PARAMS(n)) const \
    { \
      initiation_( \
          immediate_executor_binder< \
            typename decay<Handler>::type, Executor>( \
              executor_, BOOST_ASIO_MOVE_CAST(Handler)(handler)), \
          BOOST_ASIO_VARIADIC_MOVE_ARGS(n)); \
    } \
    /**/
    BOOST_ASIO_VARIADIC_GENERATE(BOOST_ASIO_PRIVATE_INIT_WRAPPER_DEF)
#undef BOOST_ASIO_PRIVATE_INIT_WRAPPER_DEF

#endif // defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

    Executor executor_;
    Initiation initiation_;
  };

#if defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

  template <typename Initiation, typename RawCompletionToken, typename... Args>
  static BOOST_ASIO_INITFN_DEDUCED_RESULT_TYPE(T, Signature,
    (async_initiate<T, Signature>(
        declval<init_wrapper<typename decay<Initiation>::type> >(),
        declval<RawCompletionToken>().get(),
        declval<BOOST_ASIO_MOVE_ARG(Args)>()...)))
  initiate(
      BOOST_ASIO_MOVE_ARG(Initiation) initiation,
      BOOST_ASIO_MOVE_ARG(RawCompletionToken) token,
      BOOST_ASIO_MOVE_ARG(Args)... args)
  {
    return async_initiate<T, Signature>(
        init_wrapper<typename decay<Initiation>::type>(
          token.get_immediate_executor(),
          BOOST_ASIO_MOVE_CAST(Initiation)(initiation)),
        token.get(), BOOST_ASIO_MOVE_CAST(Args)(args)...);
  }

#else // defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

  template <typename Initiation, typename RawCompletionToken>
  static BOOST_ASIO_INITFN_DEDUCED_RESULT_TYPE(T, Signature,
    (async_initiate<T, Signature>(
        declval<init_wrapper<typename decay<Initiation>::type> >(),
        declval<RawCompletionToken>().get())))
  initiate(
      BOOST_ASIO_MOVE_ARG(Initiation) initiation,
      BOOST_ASIO_MOVE_ARG(RawCompletionToken) token)
  {
    return async_initiate<T, Signature>(
        init_wrapper<typename decay<Initiation>::type>(
          token.get_immediate_executor(),
          BOOST_ASIO_MOVE_CAST(Initiation)(initiation)),
        token.get());
  }

#define BOOST_ASIO_PRIVATE_INITIATE_DEF(n) \
  template <typename Initiation, typename RawCompletionToken, \
      BOOST_ASIO_VARIADIC_TPARAMS(n)> \
  static BOOST_ASIO_INITFN_DEDUCED_RESULT_TYPE(T, Signature, \
    (async_initiate<T, Signature>( \
        declval<init_wrapper<typename decay<Initiation>::type> >(), \
        declval<RawCompletionToken>().get(), \
        BOOST_ASIO_VARIADIC_MOVE_DECLVAL(n)))) \
  initiate( \
      BOOST_ASIO_MOVE_ARG(Initiation) initiation, \
      BOOST_ASIO_MOVE_ARG(RawCompletionToken) token, \
      BOOST_ASIO_VARIADIC_MOVE_PARAMS(n)) \
  { \
    return async_initiate<T, Signature>( \
        init_wrapper<typename decay<Initiation>::type>( \
          token.get_immediate_executor(), \
          BOOST_ASIO_MOVE_CAST(Initiation)(initiation)), \
        token.get(), BOOST_ASIO_VARIADIC_MOVE_ARGS(n)); \
  } \
  /**/
  BOOST_ASIO_VARIADIC_GENERATE(BOOST_ASIO_PRIVATE_INITIATE_DEF)
#undef BOOST_ASIO_PRIVATE_INITIATE_DEF

#endif // defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

private:
  async_result(const async_result&) BOOST_ASIO_DELETED;
  async_result& operator=(const async_result&) BOOST_ASIO_DELETED;

  async_result<T, Signature> target_;
};

template <template <typename, typename> class Associator,
    typename T, typename Executor, typename DefaultCandidate>
struct associator<Associator,
    immediate_executor_binder<T, Executor>,
    DefaultCandidate>
  : Associator<T, DefaultCandidate>
{
  static typename Associator<T, DefaultCandidate>::type
  get(const immediate_executor_binder<T, Executor>& b)
    BOOST_ASIO_NOEXCEPT
  {
    return Associator<T, DefaultCandidate>::get(b.get());
  }

  static BOOST_ASIO_AUTO_RETURN_TYPE_PREFIX2(
      typename Associator<T, DefaultCandidate>::type)
  get(const immediate_executor_binder<T, Executor>& b,
      const DefaultCandidate& c) BOOST_ASIO_NOEXCEPT
    BOOST_ASIO_AUTO_RETURN_TYPE_SUFFIX((
      Associator<T, DefaultCandidate>::get(b.get(), c)))
  {
    return Associator<T, DefaultCandidate>::get(b.get(), c);
  }
};

template <typename T, typename Executor, typename Executor1>
struct associated_immediate_executor<
    immediate_executor_binder<T, Executor>,
    Executor1>
{
  typedef Executor type;

  static BOOST_ASIO_AUTO_RETURN_TYPE_PREFIX(type) get(
      const immediate_executor_binder<T, Executor>& b,
      const Executor1& = Executor1()) BOOST_ASIO_NOEXCEPT
    BOOST_ASIO_AUTO_RETURN_TYPE_SUFFIX((b.get_immediate_executor()))
  {
    return b.get_immediate_executor();
  }
};

#endif // !defined(GENERATING_DOCUMENTATION)

} // namespace asio
} // namespace boost

#include <boost/asio/detail/pop_options.hpp>

#endif // BOOST_ASIO_BIND_IMMEDIATE_EXECUTOR_HPP
