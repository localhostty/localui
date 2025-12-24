import { splitProps } from "solid-js";
import { Presence } from "../../utils/use-presence";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  const [local, others] = splitProps(props, [
    "forwardedRef",
    "keepMounted",
    "style",
  ]);
  const { open, internal_id } = useCollapsibleRootContext();

  return (
    <Presence
      as="div"
      id={internal_id()}
      ref={local.forwardedRef}
      {...others}
      data-open=""
    />
  );
}

export interface CollapsiblePanelProps
  extends LocalUIForward<ComponentProps<"div">, HTMLDivElement> {
  keepMounted?: true;
}
