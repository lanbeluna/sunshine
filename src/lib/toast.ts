/** Sonner placeholder: keep toast calls no-op while the demo hides global toasts. */
type ToastFn = (message?: unknown, options?: unknown) => void;

const noop: ToastFn = () => {};

export const toast = {
  success: noop,
  error: noop,
  info: noop,
  message: noop,
  warning: noop,
};
