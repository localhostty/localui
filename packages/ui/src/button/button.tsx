import { type ComponentProps, splitProps, Match, Switch, createMemo } from "solid-js";
import { Slot } from "src/slot/slot";
import { LocalUIForward } from "src/types/common";

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ["nativeButton", "forwardedRef"]);
  const nativeButton = createMemo(() => local?.nativeButton === undefined ? true : local.nativeButton);

  return (<Switch>
    <Match when={nativeButton()}>
      <Slot as="button" {...others} />
    </Match>
    <Match when={!nativeButton()}>
      <Slot as="div" type="button" {...others} />
    </Match>
  </Switch>)
}

export interface ButtonProps extends LocalUIForward<ComponentProps<'button'>, HTMLButtonElement> {
  nativeButton?: boolean
}
