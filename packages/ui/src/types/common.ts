export type LocalUIForward<T, RefType = unknown> = T & {
  forwardedRef?: RefType;
};
