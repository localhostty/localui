"use client";

import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  Setter,
  splitProps,
} from "solid-js";
import { createUniqueLocalId } from "../../utils/common";
import { useAnimationsFinished } from "../../utils/use-animations-finished";
import { useControllableState } from "../../utils/use-controllable-state";
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
  parameters: useCollapsibleRoot.Parameters,
): useCollapsibleRoot.ReturnValue {
  const [{ open: openParam, defaultOpen, onOpenChange, disabled }, _] =
    splitProps(parameters, ["open", "defaultOpen", "onOpenChange", "disabled"]);

  const isControlled = openParam() !== undefined;

  const [open, setOpen] = useControllableState({
    prop: openParam,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [animationStatus, setAnimationStatus] =
    createSignal<AnimationStatusType>("end");

  const { mounted, setMounted, transitionStatus } = useTransitionStatus(
    open,
    true,
    true,
  )();
  const [visible, setVisible] = createSignal(true);
  const [dimensions, setDimensions] = createSignal<Dimensions>({
    height: undefined,
    width: undefined,
  });
  const width = createMemo(() => dimensions().width);
  const height = createMemo(() => dimensions().height);
  const defaultPanelId = createUniqueLocalId();
  const [panelIdState, setPanelIdState] = createSignal<string | undefined>();
  const panelId = createMemo(() => panelIdState() ?? defaultPanelId);

  const [hiddenUntilFound, setHiddenUntilFound] = createSignal(false);
  const [keepMounted, setKeepMounted] = createSignal(false);

  let abortControllerRef: AbortController | null = null;
  let animationTypeRef: AnimationType = null;
  let transitionDimensionRef: "width" | "height" | null = null;
  let panelRef: HTMLElement | null = null;

  const runOnceAnimationsFinish = useAnimationsFinished(panelRef, false);

  const handleTrigger = () => {
    const nextOpen = !open();

    if (animationTypeRef === "css-animation" && panelRef != null) {
      // @ts-expect-error This should work, it just gives an error since it can't properly infer the type for some reason
      panelRef.style.removeProperty("animation-name");
    }

    if (!hiddenUntilFound && !keepMounted) {
      if (animationTypeRef != null && animationTypeRef !== "css-animation") {
        if (!mounted && nextOpen) {
          setMounted(true);
        }
      }

      if (animationTypeRef === "css-animation") {
        if (!visible() && nextOpen) {
          setVisible(true);
        }
        if (!mounted() && nextOpen) {
          setMounted(true);
        }
      }
    }

    setOpen(nextOpen);
    if (nextOpen) {
      setMounted(true);
    }

    if (animationTypeRef === "none" && mounted() && !nextOpen) {
      setMounted(false);
    }
  };

  createEffect(() => {
    /**
     * Unmount immediately when closing in controlled mode and keepMounted={false}
     * and no CSS animations or transitions are applied
     */
    if (
      isControlled &&
      animationTypeRef === "none" &&
      !keepMounted() &&
      !open()
    ) {
      setMounted(false);
    }
  });

  const result = createMemo(() => ({
    abortControllerRef,
    animationTypeRef,
    disabled,
    handleTrigger,
    height,
    mounted,
    open,
    panelId,
    panelRef,
    runOnceAnimationsFinish,
    setDimensions,
    setHiddenUntilFound,
    setKeepMounted,
    setMounted,
    setOpen,
    setPanelIdState,
    setVisible,
    transitionDimensionRef,
    transitionStatus,
    visible,
    width,
    animationStatus,
    setAnimationStatus,
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
  abortControllerRef: AbortController | null;
  animationTypeRef: AnimationType;
  /**
   * Whether the component should ignore user interaction.
   */
  disabled: Accessor<boolean>;
  handleTrigger: (event: MouseEvent | KeyboardEvent) => void;
  /**
   * The height of the panel.
   */
  height: Accessor<number | undefined>;
  // height: number | undefined;
  /**
   * Whether the collapsible panel is currently mounted.
   */
  mounted: Accessor<boolean>;
  /**
   * Whether the collapsible panel is currently open.
   */
  open: Accessor<boolean>;
  panelId: Accessor<string>;
  panelRef: HTMLElement | null;
  runOnceAnimationsFinish: (
    fnToExecute: () => void,
    signal?: AbortSignal | null,
  ) => void;
  setDimensions: Setter<Dimensions>;
  setHiddenUntilFound: Setter<boolean>;
  setKeepMounted: Setter<boolean>;
  setMounted: Setter<boolean>;
  setOpen: Setter<boolean>;
  setPanelIdState: (id: string | undefined) => void;
  setVisible: Setter<boolean>;
  transitionDimensionRef: "height" | "width" | null;
  transitionStatus: Accessor<TransitionStatus>;
  /**
   * The visible state of the panel used to determine the `[hidden]` attribute
   * only when CSS keyframe animations are used.
   */
  visible: Accessor<boolean>;
  /**
   * The width of the panel.
   */
  width: Accessor<number | undefined>;
  animationStatus: Accessor<AnimationStatusType>;
  setAnimationStatus: Setter<AnimationStatusType>;
}

export namespace useCollapsibleRoot {
  export type Parameters = UseCollapsibleRootParameters;
  export type ReturnValue = UseCollapsibleRootReturnValue;
}
