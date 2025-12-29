import {
  type Accessor,
  createEffect,
  createMemo,
  type JSX,
  Match,
  Show,
  Switch,
  splitProps,
} from "solid-js";
import { type ElementType, Slot, type SlotProps } from "../slot/slot";
import { mergeStyles } from "./merge-styles";

export type PresenceProps<T extends ElementType = "div"> = SlotProps<T> & {
  children: JSX.Element;
  open: Accessor<boolean>;
  keepMounted: Accessor<boolean>;
  animating: Accessor<boolean>;
};

export function Presence<T extends ElementType = "div">(
  props: PresenceProps<T>,
) {
  const [local, others] = splitProps(props, [
    "style",
    "open",
    "keepMounted",
    "ref",
    "animating"
  ]);
  const style = createMemo(() => {
    if (
      local.keepMounted() &&
      !local.open() &&
      !local.animating()
    ) {
      return mergeStyles({display: 'none'}, local.style)
    }
    return local.style;
  });
  const element = <Slot {...others} ref={local.ref} style={style()} />;

  return (
    <Switch>
      <Match when={local.keepMounted()}>{element}</Match>
      <Match when={!local.keepMounted()}>
        <Show when={local.open()}>{element}</Show>
      </Match>
    </Switch>
  );
}
