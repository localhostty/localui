/** biome-ignore-all lint/style/noNamespace: It's outdated, but it's used in modern libs so I will too */

import {
  type Accessor,
  type ComponentProps,
  createMemo,
  createSignal,
  type Setter,
  splitProps,
} from "solid-js";
import { Slot } from "../../slot/slot";
import { CollapsibleRootContext } from "./collapsible-root-context";

export function CollapsibleRoot(
  props: CollapsibleRoot.Props & { forwardedRef?: HTMLDivElement }
) {
  const [local, rest] = splitProps(props, [
    "class",
    "defaultOpen",
    "disabled",
    "open",
    "onOpenChange",
    "forwardedRef",
  ]);
  const [open, onOpenChange] = createSignal<boolean>(false);
  const disabled = createMemo(() => local.disabled?.() ?? false);

  const contextValue: Accessor<CollapsibleRootContext> = createMemo(() => ({
    open,
    onOpenChange,
    disabled,
  }));

  return (
    <CollapsibleRootContext.Provider value={contextValue()}>
      <Slot as="div" {...rest} />
    </CollapsibleRootContext.Provider>
  );
}

export interface CollapsibleRootState {
  /**
   * Whether the collapsible panel is currently open.
   *
   * To render an uncontrolled collapsible, use the `defaultOpen` prop instead.
   */
  open?: Accessor<boolean>;
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: Accessor<boolean>;
}

export interface CollapsibleRootProps
  extends ComponentProps<"div">,
    CollapsibleRoot.State {
  /**
   * Whether the collapsible panel is currently open.
   *
   * To render an uncontrolled collapsible, use the `defaultOpen` prop instead.
   */
  open?: Accessor<boolean>;
  /**
   * Whether the collapsible panel is initially open.
   *
   * To render a controlled collapsible, use the `open` prop instead.
   * @default false
   */
  defaultOpen?: Accessor<boolean>;
  /**
   * Event handler called when the panel is opened or closed.
   */
  onOpenChange?: Setter<boolean>;
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: Accessor<boolean>;
}

export namespace CollapsibleRoot {
  export type State = CollapsibleRootState;
  export type Props = CollapsibleRootProps;
}
