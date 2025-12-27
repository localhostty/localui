import { Accessor, createEffect, createMemo, createSignal } from "solid-js";
import { AnimationFrame } from "./use-animation-frame";

export type TransitionStatus = 'starting' | 'ending' | 'idle' | undefined;

/**
 * Provides a status string for CSS animations.
 * @param open - a boolean that determines if the element is open.
 * @param enableIdleState - a boolean that enables the `'idle'` state between `'starting'` and `'ending'`
 */
export function useTransitionStatus(
  open: Accessor<boolean>,
  enableIdleState: boolean = false,
  deferEndingState: boolean = false,
) {
  const [transitionStatus, setTransitionStatus] = createSignal<TransitionStatus>(
    open() && enableIdleState ? 'idle' : undefined,
  );
  const [mounted, setMounted] = createSignal(open());
  createEffect(() => console.log(`
    --- TRS ---
    MOUNTED: ${mounted()}
    TRS: ${transitionStatus()}
    OPEN: ${open()}
    `))

  if (open() && !mounted()) {
    setMounted(true);
    setTransitionStatus('starting');
  }

  if (!open() && mounted() && transitionStatus() !== 'ending' && !deferEndingState) {
    setTransitionStatus('ending');
  }

  if (!open() && !mounted() && transitionStatus() === 'ending') {
    setTransitionStatus(undefined);
  }

  createEffect(() => {
    if (!open() && mounted() && transitionStatus() !== 'ending' && deferEndingState) {
      const frame = AnimationFrame.request(() => {
        setTransitionStatus('ending');
      });

      return () => {
        AnimationFrame.cancel(frame);
      };
    }

    return undefined;
  }, [open, mounted, transitionStatus, deferEndingState]);

  createEffect(() => {
    if (!open() || enableIdleState) {
      return undefined;
    }

    const frame = AnimationFrame.request(() => {
      // Avoid `flushSync` here due to Firefox.
      // See https://github.com/mui/base-ui/pull/3424
      setTransitionStatus(undefined);
    });

    return () => {
      AnimationFrame.cancel(frame);
    };
  }, [enableIdleState, open]);

  createEffect(() => {
    if (!open() || !enableIdleState) {
      return undefined;
    }

    if (open() && mounted() && transitionStatus() !== 'idle') {
      setTransitionStatus('starting');
    }

    const frame = AnimationFrame.request(() => {
      setTransitionStatus('idle');
    });

    return () => {
      AnimationFrame.cancel(frame);
    };
  }, [enableIdleState, open, mounted, setTransitionStatus, transitionStatus]);

  return createMemo(
    () => ({
      mounted,
      setMounted,
      transitionStatus,
    }),
    [mounted, transitionStatus],
  );
}
