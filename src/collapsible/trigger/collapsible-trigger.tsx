import type { ComponentProps } from "solid-js";
import { Slot } from "../../slot/slot";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const { open, onOpenChange } = useCollapsibleRootContext();

  return (
    <Slot as="button" onClick={() => onOpenChange?.(!open?.())} {...props} />
  );
}

export interface CollapsibleTriggerProps extends ComponentProps<"button"> {}
