import { type ComponentProps, createMemo, splitProps } from "solid-js";
import type { LocalUIForward } from "src/types/common";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";
import { Button } from "../../button/button";

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const [local, others] = splitProps(props, ["forwardedRef", "nativeButton"]);
  const { open, disabled, onOpenChange, panelId } =
    useCollapsibleRootContext();
  const controls = createMemo(() => (open?.() ? panelId() : undefined));
  const nativeButton = createMemo(() => local?.nativeButton);

  return (
    <Button
      nativeButton={nativeButton()}
      aria-controls={controls()}
      aria-disabled={disabled?.() ?? false}
      aria-expanded={open?.()}
      onClick={() => onOpenChange?.(!open?.())}
      ref={local.forwardedRef}
      tabindex={0}
      type="button"
      {...others}
      data-panel-open={open?.() ? "" : undefined}
    />
  );
}

export interface CollapsibleTriggerProps extends LocalUIForward<
  ComponentProps<"button">,
  HTMLButtonElement
> {
  nativeButton?: boolean;
}
