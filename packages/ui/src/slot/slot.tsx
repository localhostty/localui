/** biome-ignore-all lint/suspicious/noExplicitAny: In this case the non explicit any is valid */

import {
  type Component,
  type ComponentProps,
  type JSX,
  splitProps,
} from "solid-js";
import { Dynamic } from "solid-js/web";

export type ElementType = keyof JSX.IntrinsicElements | Component<any>;

export type SlotProps<E extends ElementType> = {
  as?: E;
  children?: JSX.Element;
} & ComponentProps<E>;

export function Slot<E extends ElementType = "div">(props: SlotProps<E>) {
  const [local, rest] = splitProps(props, ["as", "children"]);
  const Element = local.as || ("div" as any);

  return (
    <Dynamic component={Element} {...rest}>
      {local.children}
    </Dynamic>
  );
}
