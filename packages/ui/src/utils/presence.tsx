import {
  type Accessor,
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
  mounted: Accessor<boolean>;
  open: Accessor<boolean>;
  keepMounted: Accessor<boolean>;
};

export function Presence<T extends ElementType = "div">(
  props: PresenceProps<T>,
) {
  const [local, others] = splitProps(props, [
    "style",
    "open",
    "keepMounted",
    "ref",
    "mounted",
  ]);
  const style = createMemo(() => {
    // Use `mounted` instead of `open` to control display:none
    // This allows close animations to run before hiding the element
    if (local.keepMounted() && !local.mounted()) {
      return mergeStyles({ display: "none" }, local.style);
    }
    return local.style;
  });
  const element = <Slot {...others} ref={local.ref} style={style()} />;

  return (
    <Switch>
      <Match when={local.keepMounted()}>{element}</Match>
      <Match when={!local.keepMounted()}>
        <Show when={local.mounted()}>{element}</Show>
      </Match>
    </Switch>
  );
}
