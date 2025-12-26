import {
  type ComponentProps,
  createEffect,
  createMemo,
  splitProps,
} from "solid-js";
import { Presence } from "../../utils/presence";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  const [local, others] = splitProps(props, [
    "keepMounted",
    "id",
  ]);
  const { open, panelId, setPanelId, disabled, triggerId } = useCollapsibleRootContext();
  const keepMounted = createMemo(() => local.keepMounted ?? false);
  createEffect(() => {
    if (local.id && local.id !== panelId()) {
      setPanelId(local.id);
    if (local.id && local.id !== panelId()) {
      setPanelId(local.id);
    }
  }});

  return (
    <Presence
      as="div"
      id={panelId()}
      keepMounted={keepMounted}
      open={open}
      role="region"
      aria-labelledby={triggerId()}
      aria-hidden={!open() || undefined}
      {...others}
      data-closed={open() ? undefined : ""}
      data-open={open() ? "" : undefined}
      data-disabled={disabled() ? "" : undefined}
    />
  );
}

export interface CollapsiblePanelProps
  extends ComponentProps<"div"> {
  keepMounted?: boolean;
}
