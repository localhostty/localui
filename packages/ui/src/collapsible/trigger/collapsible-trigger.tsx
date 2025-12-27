import {
  type ComponentProps,
  createEffect,
  createMemo,
  splitProps,
} from "solid-js";
import { Button } from "../../button/button";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";
import { useKey } from "../../utils/use-key";

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

  createEffect(() => console.log("TRIGGER OPEN: ", open()));

  return (
    <Button
      aria-controls={controls()}
      aria-expanded={open()}
      disabled={buttonDisabled()}
      aria-disabled={buttonDisabled()}
      nativeButton={nativeButton()}
      onClick={handleTrigger}
      type="button"
      id={triggerId()}
      ref={local.ref}
      {...others}
      data-panel-open={open() ? "" : undefined}
    />
  );
}

export interface CollapsibleTriggerProps extends ComponentProps<"button"> {
  nativeButton?: boolean;
}
