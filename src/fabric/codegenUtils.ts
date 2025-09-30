// codegen will generate folly::dynamic in place of this type, but it's not exported by RN
// since codegen doesn't really follow imports, this way we can trick it into generating the correct type
// while keeping typescript happy
export type UnsafeMixed<T> = T;

// Fabric doesn't support optional props, so we need to use UnsafeMixed
// https://github.com/rnmapbox/maps/pull/3082#discussion_r1339858750
export type OptionalProp<T> = UnsafeMixed<T>;
