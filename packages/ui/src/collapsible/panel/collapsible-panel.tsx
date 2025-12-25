import {
  type ComponentProps,
  createEffect,
  createMemo,
  splitProps,
} from "solid-js";
import type { LocalUIForward } from "../../types/common";
import { Presence } from "../../utils/presence";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  const [local, others] = splitProps(props, [
    "forwardedRef",
    "keepMounted",
    "id",
  ]);
  const { open, panelId, setPanelId } = useCollapsibleRootContext();
  const keepMounted = createMemo(() => local.keepMounted ?? false);
  createEffect(() => {
    if (local.id && local.id !== panelId()) {
      setPanelId(local.id);
    }
  });

  return (
    <Presence
      as="div"
      id={panelId()}
      keepMounted={keepMounted}
      open={open}
      ref={local.forwardedRef}
      {...others}
      data-open=""
    />
  );
}

export interface CollapsiblePanelProps extends LocalUIForward<
  ComponentProps<"div">,
  HTMLDivElement
> {
  keepMounted?: boolean;
}
