import {
  type ComponentProps,
  createEffect,
  createMemo,
  splitProps,
} from "solid-js";
import { Button } from "../../button/button";
import { useKey } from "../../utils/use-key";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const [local, others] = splitProps(props, [
    "nativeButton",
    "disabled",
    "id",
    "ref",
  ]);
  const {
    open,
    disabled,
    onOpenChange,
    panelId,
    triggerId,
    setTriggerId,
    handleTrigger,
  } = useCollapsibleRootContext();
  const controls = createMemo(() => (open() ? panelId() : undefined));
  const nativeButton = createMemo(() => local?.nativeButton);
  const buttonDisabled = createMemo(() => local.disabled ?? disabled());
  createEffect(() => {
    if (local.id && local.id !== triggerId()) {
      setTriggerId(local.id);
    }
  });
  useKey<HTMLButtonElement>({
    key: "Escape",
    action: () => onOpenChange(false),
    ref: local.ref,
  });

  return (
    <Button
      aria-controls={controls()}
      aria-disabled={buttonDisabled()}
      aria-expanded={open()}
      disabled={buttonDisabled()}
      id={triggerId()}
      nativeButton={nativeButton()}
      onClick={handleTrigger}
      ref={local.ref}
      type="button"
      {...others}
      data-panel-open={open() ? "" : undefined}
    />
  );
}

export interface CollapsibleTriggerProps extends ComponentProps<"button"> {
  nativeButton?: boolean;
}
