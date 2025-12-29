import {
  type ComponentProps,
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
} from "solid-js";
import { mergeStyles } from "../../utils/merge-styles";
import { Presence } from "../../utils/presence";
import { useOpenChangeComplete } from "../../utils/use-open-change-complete";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";
import { CollapsiblePanelCssVars } from "./collapsible-panel-css-vars";

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  const [local, others] = splitProps(props, ["keepMounted", "id", "style"]);
  const context = useCollapsibleRootContext();
  const {
    open,
    panelId,
    setPanelId,
    disabled,
    triggerId,
    transitionStatus,
    setDimensions,
    height,
    width,
    mounted,
    setMounted,
    animationStatus,
    setAnimationStatus,
  } = context;
  let panelRef: HTMLElement | null = null;

  let { animationTypeRef, transitionDimensionRef } = context;
  const keepMounted = createMemo(() => local.keepMounted ?? false);
  createEffect(() => {
    if (local.id && local.id !== panelId()) {
      setPanelId(local.id);
      if (local.id && local.id !== panelId()) {
        setPanelId(local.id);
      }
    }
  });
  const animationState = createMemo(() => ({
    [`data-${transitionStatus()}`]: "",
  }));
  const handlePanelRef = (element: HTMLElement) => {
    if (!element) {
      return undefined;
    }
    if (animationTypeRef == null || transitionDimensionRef == null) {
      const panelStyles = getComputedStyle(element);

      const hasAnimation =
        panelStyles.animationName !== "none" &&
        panelStyles.animationName !== "";
      const hasTransition =
        panelStyles.transitionDuration !== "0s" &&
        panelStyles.transitionDuration !== "";

      if (hasAnimation && hasTransition) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "CSS transitions and CSS animations both detected on Collapsible or Accordion panel.",
            "Only one of either animation type should be used.",
          );
        }
      } else if (
        panelStyles.animationName === "none" &&
        panelStyles.transitionDuration !== "0s"
      ) {
        animationTypeRef = "css-transition";
      } else if (
        panelStyles.animationName !== "none" &&
        panelStyles.transitionDuration === "0s"
      ) {
        animationTypeRef = "css-animation";
      } else {
        animationTypeRef = "none";
      }
    }
  };
  createEffect(() => {
    if (panelRef) {
      handlePanelRef(panelRef);
    }
  });
  createEffect(() => {
    if (!panelRef) {
      return undefined;
    }

    if (!open()) {
      // @ts-expect-error for some reason it doesn't infer correctly :/
      if (panelRef.scrollHeight === 0 && panelRef.scrollWidth === 0) {
        return undefined;
      }

      // setDimensions({
      // // @ts-expect-error for some reason it doesn't infer correctly :/
      //   height: panelRef.scrollHeight,
      // // @ts-expect-error for some reason it doesn't infer correctly :/
      //   width: panelRef.scrollWidth,
      // });
    }
  });

  createEffect(() => {
    if (open() && height() === undefined && panelRef) {
      // @ts-expect-error for some reason it doesn't infer correctly :/
      const measured = panelRef.scrollHeight;
      setDimensions({ height: measured, width: width() });
    }
  });


  return (
    <Presence
    animating={() => true}
      aria-hidden={!open() || undefined}
      aria-labelledby={triggerId()}
      as="div"
      id={panelId()}
      keepMounted={keepMounted}
      open={open}
      ref={panelRef}
      role="region"
      style={mergeStyles(
        {
          [CollapsiblePanelCssVars.collapsiblePanelHeight as string]:
            height() === undefined ? "auto" : `${height()}px`,
          [CollapsiblePanelCssVars.collapsiblePanelWidth as string]:
            width() === undefined ? "auto" : `${width()}px`,
        },
        local.style,
      )}
      {...others}
      data-closed={open() ? undefined : ""}
      data-disabled={disabled() ? "" : undefined}
      data-open={open() ? "" : undefined}
      onTransitionCancel={() => setAnimationStatus("cancel")}
      onTransitionEnd={() => setAnimationStatus("end")}
      onTransitionRun={() => setAnimationStatus("run")}
      onTransitionStart={() => setAnimationStatus("start")}
      {...animationState()}
    />
  );
}

export interface CollapsiblePanelProps extends ComponentProps<"div"> {
  keepMounted?: boolean;
}
