import { createEffect, splitProps } from "solid-js";
import { useAnimationsFinished } from "./use-animations-finished";

export function useOpenChangeComplete(
  parameters: useOpenChangeComplete.Parameters,
) {
  const [{ enabled = true, open, ref, onComplete: onCompleteParam }] =
    splitProps(parameters, ["enabled", "onComplete", "open", "ref"]);

  const onComplete = () => onCompleteParam();
  const runOnceAnimationsFinish = useAnimationsFinished(ref, open, false);

  createEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const abortController = new AbortController();

    runOnceAnimationsFinish(onComplete, abortController.signal);

    return () => {
      abortController.abort();
    };
  });
}

export interface UseOpenChangeCompleteParameters {
  /**
   * Whether the hook is enabled.
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether the element is open.
   */
  open?: boolean;
  /**
   * Ref to the element being closed.
   */
  ref: HTMLElement | null;
  /**
   * Function to call when the animation completes (or there is no animation).
   */
  onComplete: () => void;
}

export namespace useOpenChangeComplete {
  export type Parameters = UseOpenChangeCompleteParameters;
}
