"use client";

import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  Setter,
  splitProps,
} from "solid-js";
import { useControllableState } from "../../utils/use-controllable-state";
import {
  AnimationTracker,
  createAnimationTracker,
} from "../../utils/create-animation-tracker";
import { createUniqueLocalId } from "../../utils/common";
import {
  TransitionStatus,
  useTransitionStatus,
} from "../../utils/use-transition-status";

export type AnimationType = "css-transition" | "css-animation" | "none" | null;
export type AnimationStatusType = "start" | "run" | "end" | "cancel";

export interface Dimensions {
  height: number | undefined;
  width: number | undefined;
}

export function useCollapsibleRoot(
  parameters: useCollapsibleRoot.Parameters
): useCollapsibleRoot.ReturnValue {
  const [
    { open: openParam, defaultOpen, onOpenChange: onOpenChangeParam, disabled },
    _,
  ] = splitProps(parameters, [
    "open",
    "defaultOpen",
    "onOpenChange",
    "disabled",
  ]);

  const isControlled = openParam() !== undefined;

  const tracker = createAnimationTracker();
  const [open, onOpenChange] = useControllableState({
    prop: openParam,
    defaultProp: defaultOpen,
    onChange: onOpenChangeParam,
  });
  const [expanded, setExpanded] = createSignal(open());
  const { mounted, setMounted, transitionStatus } = useTransitionStatus(
    open,
    true,
    true
  )();
  const [panelId, setPanelId] = createSignal(createUniqueLocalId());
  const [dimensions, setDimensions] = createSignal<Dimensions>({
    height: undefined,
    width: undefined,
  });
  const width = createMemo(() => dimensions().width);
  const height = createMemo(() => dimensions().height);
  const [keepMounted, setKeepMounted] = createSignal(false);

  const handleTrigger = () => {
    if (!open()) {
      onOpenChange(true);
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          tracker.notifyStateChange();
          setExpanded(true);
        });
      });
    } else {
      tracker.notifyStateChange();
      onOpenChange(false);
      setExpanded(false);
    }
  };

  createEffect(() => {
    /**
     * Unmount immediately when closing in controlled mode and keepMounted={false}
     * and no CSS animations or transitions are applied
     */
    if (isControlled && !keepMounted() && !open()) {
      setMounted(false);
    }
  });

  const result = createMemo(() => ({
    disabled,
    handleTrigger,
    height,
    mounted,
    open,
    panelId,
    setPanelId,
    setDimensions,
    setKeepMounted,
    setMounted,
    onOpenChange,
    width,
    tracker,
    expanded,
    setExpanded,
    transitionStatus,
  }));
  return result();
}

export interface UseCollapsibleRootParameters {
  /**
   * Whether the collapsible panel is currently open.
   *
   * To render an uncontrolled collapsible, use the `defaultOpen` prop instead.
   */
  open: Accessor<boolean | undefined>;
  /**
   * Whether the collapsible panel is initially open.
   *
   * To render a controlled collapsible, use the `open` prop instead.
   * @default false
   */
  defaultOpen: Accessor<boolean>;
  /**
   * Event handler called when the panel is opened or closed.
   */
  onOpenChange?: Setter<boolean>;
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled: Accessor<boolean>;
}

export interface UseCollapsibleRootReturnValue {
  /**
   * Whether the component should ignore user interaction.
   */
  disabled: Accessor<boolean>;
  handleTrigger: () => void;
  /**
   * The height of the panel.
   */
  height: Accessor<number | undefined>;
  /**
   * The width of the panel.
   */
  width: Accessor<number | undefined>;
  setDimensions: Setter<Dimensions>;
  setKeepMounted: Setter<boolean>;
  /**
   * Whether the collapsible panel is currently mounted.
   */
  mounted: Accessor<boolean>;
  setMounted: Setter<boolean>;
  /**
   * Whether the collapsible panel is currently open.
   */
  open: Accessor<boolean>;
  onOpenChange: Setter<boolean>;
  /**
   * Whether the collapsible is actually expanded
   */
  expanded: Accessor<boolean>;
  setExpanded: Setter<boolean>;
  panelId: Accessor<string>;
  setPanelId: Setter<string>;
  tracker: AnimationTracker;
  transitionStatus: Accessor<TransitionStatus>;
}

export namespace useCollapsibleRoot {
  export type Parameters = UseCollapsibleRootParameters;
  export type ReturnValue = UseCollapsibleRootReturnValue;
}
