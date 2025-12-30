import { Accessor, createSignal, onCleanup } from "solid-js";

export type AnimationState = "idle" | "running" | "completed" | "cancelled";

export interface AnimationTracker {
  /** Current animation state */
  state: Accessor<AnimationState>;
  /** Whether an animation is currently running */
  isAnimating: Accessor<boolean>;
  /** Whether the last animation completed successfully (not cancelled) */
  didComplete: Accessor<boolean>;
  /** Total count of completed animations */
  completedCount: Accessor<number>;
  /** Total count of cancelled animations */
  cancelledCount: Accessor<number>;
  /** Call this when triggering a state change that should animate */
  notifyStateChange: () => void;
  /** Event handlers to attach to the animated element */
  handlers: {
    onTransitionStart: (e: TransitionEvent) => void;
    onTransitionEnd: (e: TransitionEvent) => void;
    onTransitionCancel: (e: TransitionEvent) => void;
  };
}

/**
 * Creates a robust animation tracker for CSS transitions.
 * Tracks animation lifecycle with high accuracy, handling edge cases like:
 * - Multiple concurrent transitions on the same element
 * - Interrupted/cancelled animations
 * - Rapid state changes before animation completes
 * - Fallback timeout if transitionend doesn't fire
 */
export function createAnimationTracker(options?: {
  /** Timeout fallback in ms (default: 5000). Set to 0 to disable. */
  timeoutFallback?: number;
  /** Debug mode logs state changes to console */
  debug?: boolean;
}): AnimationTracker {
  const { timeoutFallback = 5000, debug = false } = options ?? {};

  const [state, setState] = createSignal<AnimationState>("idle");
  const [completedCount, setCompletedCount] = createSignal(0);
  const [cancelledCount, setCancelledCount] = createSignal(0);

  // Track pending transitions to handle multiple properties animating
  let pendingTransitions = new Set<string>();
  let stateChangeId = 0;
  let fallbackTimeoutId: ReturnType<typeof setTimeout> | null = null;

  const log = (...args: unknown[]) => {
    if (debug) console.log("[AnimationTracker]", ...args);
  };

  const clearFallbackTimeout = () => {
    if (fallbackTimeoutId !== null) {
      clearTimeout(fallbackTimeoutId);
      fallbackTimeoutId = null;
    }
  };

  const setFallbackTimeout = (id: number) => {
    if (timeoutFallback <= 0) return;

    clearFallbackTimeout();
    fallbackTimeoutId = setTimeout(() => {
      if (stateChangeId === id && state() === "running") {
        log("Fallback timeout triggered - forcing completion");
        pendingTransitions.clear();
        setState("completed");
        setCompletedCount((c) => c + 1);
      }
    }, timeoutFallback);
  };

  /**
   * Call this when you trigger a state change that should cause an animation.
   * This primes the tracker to expect transitions.
   */
  const notifyStateChange = () => {
    stateChangeId++;
    const currentId = stateChangeId;
    pendingTransitions.clear();
    clearFallbackTimeout();

    // Reset state to idle - this prevents effects from firing based on
    // the previous animation's "completed" state
    setState("idle");

    log("State change notified, id:", currentId);

    // Use double rAF to ensure we're past the point where transitions would start
    // This handles the case where no transition actually runs
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (currentId === stateChangeId && pendingTransitions.size === 0) {
          // No transitions started - element might not be visible,
          // or transition properties didn't actually change
          if (state() !== "running") {
            log("No transitions detected - completing immediately");
            setState("completed");
            setCompletedCount((c) => c + 1);
          }
        }
      });
    });
  };

  const handleTransitionStart = (e: TransitionEvent) => {
    // Only track transitions on the element itself, not bubbled from children
    if (e.target !== e.currentTarget) return;

    const prop = e.propertyName;
    pendingTransitions.add(prop);
    log("Transition start:", prop, "pending:", [...pendingTransitions]);

    if (state() !== "running") {
      setState("running");
      setFallbackTimeout(stateChangeId);
    }
  };

  const handleTransitionEnd = (e: TransitionEvent) => {
    if (e.target !== e.currentTarget) return;

    const prop = e.propertyName;
    pendingTransitions.delete(prop);
    log("Transition end:", prop, "remaining:", [...pendingTransitions]);

    if (pendingTransitions.size === 0 && state() === "running") {
      clearFallbackTimeout();
      setState("completed");
      setCompletedCount((c) => c + 1);
      log("All transitions completed");
    }
  };

  const handleTransitionCancel = (e: TransitionEvent) => {
    if (e.target !== e.currentTarget) return;

    const prop = e.propertyName;
    pendingTransitions.delete(prop);
    log("Transition cancel:", prop, "remaining:", [...pendingTransitions]);

    if (pendingTransitions.size === 0 && state() === "running") {
      clearFallbackTimeout();
      setState("cancelled");
      setCancelledCount((c) => c + 1);
      log("All transitions cancelled");
    }
  };

  // Cleanup on unmount
  onCleanup(() => {
    clearFallbackTimeout();
  });

  return {
    state,
    isAnimating: () => state() === "running",
    didComplete: () => state() === "completed",
    completedCount,
    cancelledCount,
    notifyStateChange,
    handlers: {
      onTransitionStart: handleTransitionStart,
      onTransitionEnd: handleTransitionEnd,
      onTransitionCancel: handleTransitionCancel,
    },
  };
}
