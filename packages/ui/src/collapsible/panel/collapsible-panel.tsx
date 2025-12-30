import {
  type ComponentProps,
  createMemo,
  createSignal,
  splitProps,
} from "solid-js";
import { mergeStyles } from "../../utils/merge-styles";
import { Presence } from "../../utils/presence";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";
import { CollapsiblePanelCssVars } from "./collapsible-panel-css-vars";
import { useCollapsiblePanel } from "./use-collapsible-panel";

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  const [local, others] = splitProps(props, ["keepMounted", "id", "style"]);
  const context = useCollapsibleRootContext();
  const {
    open,
    panelId,
    mounted,
    expanded,
    setMounted,
    setPanelId,
    disabled,
    triggerId,
    setDimensions,
    height,
    width,
    tracker,
    transitionStatus,
  } = context;
  const [panelRef, _setPanelRef] = createSignal<HTMLElement | null>(null);

  const setPanelRef = (el: HTMLElement | null) => {
    _setPanelRef(el);
  };

  const keepMounted = createMemo(() => local.keepMounted ?? false);
  useCollapsiblePanel({
    id: local.id,
    height,
    width,
    open,
    panelId,
    panelRef,
    setPanelId,
    setMounted,
    tracker,
    setDimensions,
  });

  const animationState = createMemo(() => ({
    [`data-${transitionStatus()}`]: "",
  }));

  return (
    <Presence
      aria-hidden={!open() || undefined}
      aria-labelledby={triggerId()}
      as="div"
      id={panelId()}
      keepMounted={keepMounted}
      open={expanded}
      mounted={mounted}
      ref={setPanelRef}
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
      onTransitionCancel={tracker.handlers.onTransitionCancel}
      onTransitionEnd={tracker.handlers.onTransitionEnd}
      onTransitionStart={tracker.handlers.onTransitionStart}
      {...animationState()}
    />
  );
}

export interface CollapsiblePanelProps extends ComponentProps<"div"> {
  keepMounted?: boolean;
}
