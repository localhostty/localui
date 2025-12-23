import { type ComponentProps, Show, splitProps } from "solid-js";
import type { LocalUIForward } from "src/types/common";
import { Slot } from "../../slot/slot";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  const [local, others] = splitProps(props, ["forwardedRef"]);
  const { open, internal_id } = useCollapsibleRootContext();

  console.log("OPEN: ", open?.());
  return (
    <Show when={open?.()}>
      <Slot
        as="div"
        id={internal_id?.()}
        ref={local.forwardedRef}
        {...others}
        data-open=""
      />
    </Show>
  );
}

export interface CollapsiblePanelProps
  extends LocalUIForward<ComponentProps<"div">, HTMLDivElement> {}
