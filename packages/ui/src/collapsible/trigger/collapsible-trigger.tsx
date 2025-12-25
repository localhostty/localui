import { type ComponentProps, createMemo, splitProps } from "solid-js";
import type { LocalUIForward } from "src/types/common";
import { Slot } from "../../slot/slot";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const [local, others] = splitProps(props, ["forwardedRef"]);
  const { open, disabled, onOpenChange, internal_id } =
    useCollapsibleRootContext();
  const controls = createMemo(() => (open?.() ? internal_id() : undefined));

  return (
    <Slot
      aria-controls={controls()}
      aria-disabled={disabled?.() ?? false}
      aria-expanded={open?.()}
      as="button"
      onClick={() => onOpenChange?.(!open?.())}
      ref={local.forwardedRef}
      tabindex={0}
      type="button"
      {...others}
      data-panel-open={open?.() ? "" : undefined}
    />
  );
}

export interface CollapsibleTriggerProps
  extends LocalUIForward<ComponentProps<"button">, HTMLButtonElement> {}
