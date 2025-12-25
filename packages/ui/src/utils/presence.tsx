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

export type PresenceProps<T extends ElementType = "div"> = SlotProps<T> & {
  children: JSX.Element;
  open: Accessor<boolean>;
  keepMounted?: Accessor<boolean>;
};

export function Presence<T extends ElementType = "div">(
  props: PresenceProps<T>,
) {
  const [local, others] = splitProps(props, ["style", "open", "keepMounted"]);
  const style = createMemo(() => {
    if (
      typeof local.style === "string" &&
      local?.keepMounted() &&
      !local?.open()
    ) {
      return `${local.style};display: none`;
    }
    if (
      local?.keepMounted() &&
      typeof local.style !== "string" &&
      !local?.open()
    ) {
      return { ...local.style, display: "none" };
    }
    return local.style;
  });
  const element = <Slot {...others} style={style()} />;

  return (
    <Switch fallback={<p>Fallback content</p>}>
      <Match when={local?.keepMounted()}>{element}</Match>
      <Match when={!local?.keepMounted()}>
        <Show when={local?.open()}>{element}</Show>
      </Match>
    </Switch>
  );
}
