import {
  type ComponentProps,
  createMemo,
  Match,
  Switch,
  splitProps,
} from "solid-js";
import { Slot } from "../slot/slot";

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ["nativeButton"]);
  const nativeButton = createMemo(() =>
    local?.nativeButton === undefined ? true : local.nativeButton,
  );

  return (
    <Switch>
      <Match when={nativeButton()}>
        <Slot as="button" {...others} />
      </Match>
      <Match when={!nativeButton()}>
        <Slot as="div" role="button" tabindex={0} {...others} />
      </Match>
    </Switch>
  );
}

export interface ButtonProps extends ComponentProps<"button"> {
  nativeButton?: boolean;
}
