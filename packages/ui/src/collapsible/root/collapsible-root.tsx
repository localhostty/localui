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
import { useCollapsibleRoot } from "./use-collapsible-root";
import { createUniqueLocalId } from "../../utils/common";

export function CollapsibleRoot(props: CollapsibleRoot.Props) {
  const [local, rest] = splitProps(props, [
    "defaultOpen",
    "disabled",
    "open",
    "onOpenChange",
  ]);
  const defaultOpen = createMemo(() => local.defaultOpen ?? false);
  const disabled = createMemo(() => local.disabled ?? false);
  const openProp = createMemo(() => local.open);
  const [triggerId, setTriggerId] = createSignal(createUniqueLocalId());

  const collapsible = useCollapsibleRoot({
    open: openProp,
    defaultOpen,
    onOpenChange: local.onOpenChange,
    disabled,
  });
  const contextValue: Accessor<CollapsibleRootContext> = createMemo(() => ({
    ...collapsible,
    triggerId,
    setTriggerId,
  }));

  return (
    <CollapsibleRootContext.Provider value={contextValue()}>
      <Slot
        as="div"
        data-closed={collapsible.open() ? undefined : ""}
        data-open={collapsible.open() ? "" : undefined}
        {...rest}
      />
    </CollapsibleRootContext.Provider>
  );
}

export interface CollapsibleRootState {
  /**
   * Whether the collapsible panel is currently open.
   *
   * To render an uncontrolled collapsible, use the `defaultOpen` prop instead.
   */
  open?: boolean;
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: boolean;
}

export interface CollapsibleRootProps
  extends ComponentProps<"div">, CollapsibleRoot.State {
  /**
   * Whether the collapsible panel is currently open.
   *
   * To render an uncontrolled collapsible, use the `defaultOpen` prop instead.
   */
  open?: boolean;
  /**
   * Whether the collapsible panel is initially open.
   *
   * To render a controlled collapsible, use the `open` prop instead.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Event handler called when the panel is opened or closed.
   */
  onOpenChange?: Setter<boolean>;
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: boolean;
}

export namespace CollapsibleRoot {
  export type State = CollapsibleRootState;
  export type Props = CollapsibleRootProps;
}
