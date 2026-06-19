/** Sonner placeholder: keep toast calls no-op while global toasts are hidden. */
type ToastFn = (message?: unknown, options?: unknown) => void;

const noop: ToastFn = () => {};

export const toast = {
  success: noop,
  error: noop,
  info: noop,
  message: noop,
  warning: noop,
};
