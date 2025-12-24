import {
  type Accessor,
  createMemo,
  type JSX,
  Show,
  splitProps,
} from "solid-js";
import { type ElementType, Slot, type SlotProps } from "../slot/slot";

export type PresenceProps<T extends ElementType = "div"> = SlotProps<T> & {
  children: JSX.Element;
  hidden: Accessor<boolean>;
  keepMounted: Accessor<boolean>;
};

export function Presence<T extends ElementType = "div">(
  props: PresenceProps<T>
) {
  const [local, others] = splitProps(props, ["style", "hidden", "keepMounted"]);
  const style = createMemo(() => {
    if (
      typeof local.style === "string" &&
      local.keepMounted() &&
      local.hidden()
    ) {
      return `${local.style};display: none`;
    }
    if (
      local.keepMounted() &&
      typeof local.style !== "string" &&
      local.hidden()
    ) {
      return { ...local.style, display: "none" };
    }
    return local.style;
  });
  // @ts-expect-error
  const element = <Slot {...others} style={style} />;

  return props.keepMounted() ? (
    element
  ) : (
    <Show when={props.hidden()}>{element}</Show>
  );
}
