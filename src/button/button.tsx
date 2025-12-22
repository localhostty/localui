import { type ComponentProps, splitProps } from "solid-js";

export function Button(props: ComponentProps<"button">) {
  const [local, others] = splitProps(props, ["children"]);
  return <button {...others}>{local.children}</button>;
}
