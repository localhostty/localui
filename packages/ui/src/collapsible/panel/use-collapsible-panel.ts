"use client";

import { Accessor, createEffect, on, Setter, splitProps } from "solid-js";
import { AnimationTracker } from "../../utils/create-animation-tracker";

export type AnimationType = "css-transition" | "css-animation" | "none" | null;
export type AnimationStatusType = "start" | "run" | "end" | "cancel";

export interface Dimensions {
  height: number | undefined;
  width: number | undefined;
}

export function useCollapsiblePanel(
  parameters: useCollapsiblePanel.Parameters
): useCollapsiblePanel.ReturnValue | void {
  const {
    id,
    panelId,
    setPanelId,
    open,
    height,
    panelRef,
    setDimensions,
    width,
    tracker,
    setMounted,
  } = parameters;

  createEffect(() => {
    if (id && id !== panelId()) {
      setPanelId(id);
    }
  });

  createEffect(() => {
    const el = panelRef();
    const isOpen = open();
    const currentHeight = height();

    if (isOpen && currentHeight === undefined && el) {
      el.style.setProperty("height", "auto", "important");

      const measured = el.scrollHeight;

      el.style.removeProperty("height");

      setDimensions({
        height: measured > 0 ? measured : undefined,
        width: width(),
      });
    }
  });

  createEffect(
    on(
      [tracker.state, () => open()],
      ([animState, isOpen]) => {
        if (
          !isOpen &&
          (animState === "completed" || animState === "cancelled")
        ) {
          setMounted(false);
        }
      },
      { defer: true }
    )
  );
}

export interface UseCollapsiblePanelParameters {
  id?: string;
  panelId: Accessor<string>;
  setPanelId: Setter<string>;
  open: Accessor<boolean>;
  panelRef: Accessor<HTMLElement | null>;
  height: Accessor<number | undefined>;
  width: Accessor<number | undefined>;
  setDimensions: Setter<Dimensions>;
  setMounted: Setter<boolean>;
  tracker: AnimationTracker;
}

export interface UseCollapsiblePanelReturnValue {}

export namespace useCollapsiblePanel {
  export type Parameters = UseCollapsiblePanelParameters;
  export type ReturnValue = UseCollapsiblePanelReturnValue;
}
