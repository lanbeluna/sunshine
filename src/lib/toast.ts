/** Sonner 占位：全局关闭顶部提示，调用不产生任何 UI */
function noop(..._args: unknown[]): void {}

export const toast = {
  success: noop,
  error: noop,
  info: noop,
  message: noop,
  warning: noop,
};
