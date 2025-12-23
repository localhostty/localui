import { type ComponentProps, splitProps } from "solid-js";
import { Slot } from "../../slot/slot";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  const [local, others] = splitProps(props, ["forwardedRef"]);
  const { open } = useCollapsibleRootContext();

  return (
    <Slot
      as="div"
      ref={local.forwardedRef}
      style={{
        display: open?.() ? "block" : "none",
      }}
      {...others}
    />
  );
}

export interface CollapsiblePanelProps extends ComponentProps<"div"> {
  forwardedRef?: HTMLDivElement;
}
