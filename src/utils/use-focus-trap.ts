import { createEffect } from "solid-js";

export function useFocusTrap(ref: HTMLElement, isActive: boolean) {
  createEffect(() => {
    if (!(isActive && ref)) {
      return;
    }
    const element = ref;
    const focusableSelector =
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';
    const focusableElements =
      element.querySelectorAll<HTMLElement>(focusableSelector);
    const firstFocusable = focusableElements[0];
    // biome-ignore lint/style/useAtIndex: .at doesn't exist on focusableElements
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") {
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    };
    element.addEventListener("keydown", handleTabKey);
    firstFocusable?.focus();
    return () => {
      element.removeEventListener("keydown", handleTabKey);
    };
  }, [ref, isActive]);
}
