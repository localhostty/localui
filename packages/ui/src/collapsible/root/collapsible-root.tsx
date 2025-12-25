/** biome-ignore-all lint/style/noNamespace: It's outdated, but it's used in modern libs so I will too */

import {
  type Accessor,
  type ComponentProps,
  createMemo,
  type Setter,
  splitProps,
} from "solid-js";
import { Slot } from "../../slot/slot";
import type { LocalUIForward } from "../../types/common";
import { createUniqueLocalId } from "../../utils/common";
import { useControllableState } from "../../utils/use-controllable-state";
import { CollapsibleRootContext } from "./collapsible-root-context";

export function CollapsibleRoot(
  props: LocalUIForward<CollapsibleRoot.Props, HTMLDivElement>
) {
  const [local, rest] = splitProps(props, [
    "class",
    "defaultOpen",
    "disabled",
    "open",
    "onOpenChange",
    "forwardedRef",
    "internal_id",
  ]);
  const defaultOpen = createMemo(() => local.defaultOpen?.() ?? false);
  const [open, onOpenChange] = useControllableState({
    prop: local.open,
    defaultProp: defaultOpen,
    onChange: local.onOpenChange,
  });
  const disabled = createMemo(() => local.disabled?.() ?? false);
  const id = createMemo(() => local?.internal_id ?? createUniqueLocalId());

  const contextValue: Accessor<CollapsibleRootContext> = createMemo(() => ({
    open,
    onOpenChange,
    disabled,
    internal_id: id,
  }));

  return (
    <CollapsibleRootContext.Provider value={contextValue()}>
      <Slot
        as="div"
        data-closed={open?.() ? undefined : ""}
        data-open={open?.() ? "" : undefined}
        ref={local.forwardedRef}
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
  open?: Accessor<boolean>;
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: Accessor<boolean>;
  internal_id?: string;
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
