import { type ComponentProps, createMemo, splitProps } from "solid-js";
import type { LocalUIForward } from "../../types/common";
import { Presence } from "../../utils/presence";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  const [local, others] = splitProps(props, [
    "forwardedRef",
    "keepMounted",
    "style",
  ]);
  const { open, internal_id } = useCollapsibleRootContext();
  const keepMounted = createMemo(() => local.keepMounted ?? false);

  return (
    <Presence
      as="div"
      id={internal_id()}
      keepMounted={keepMounted}
      open={open}
      ref={local.forwardedRef}
      {...others}
      data-open=""
    />
  );
}

export interface CollapsiblePanelProps
  extends LocalUIForward<ComponentProps<"div">, HTMLDivElement> {
  keepMounted?: boolean;
}
