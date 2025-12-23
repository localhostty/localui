import { type ComponentProps, splitProps } from "solid-js";
import type { LocalUIForward } from "src/types/common";
import { Slot } from "../../slot/slot";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const [local, others] = splitProps(props, ["forwardedRef"]);
  const { open, onOpenChange } = useCollapsibleRootContext();

  return (
    <Slot
      as="button"
      onClick={() => onOpenChange?.(!open?.())}
      ref={local.forwardedRef}
      {...others}
    />
  );
}

export interface CollapsibleTriggerProps
  extends LocalUIForward<ComponentProps<"button">, HTMLButtonElement> {}
