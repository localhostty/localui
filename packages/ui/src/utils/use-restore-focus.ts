export function useRestoreFocus() {
  let previousFocus: HTMLElement | null = null;
  const saveFocus = () => {
    previousFocus = document.activeElement as HTMLElement;
  };
  const restoreFocus = () => {
    previousFocus?.focus();
  };
  return { saveFocus, restoreFocus };
}
