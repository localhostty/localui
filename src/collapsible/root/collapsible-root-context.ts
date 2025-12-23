import {
  type Accessor,
  createContext,
  type Setter,
  useContext,
} from "solid-js";
import type { CollapsibleRoot } from "./collapsible-root";

export interface CollapsibleRootContext extends CollapsibleRoot.Props {
  open?: Accessor<boolean>;
  onOpenChange?: Setter<boolean>;
  disabled?: Accessor<boolean>;
  internal_id?: Accessor<string>;
}

export const CollapsibleRootContext = createContext<
  CollapsibleRootContext | undefined
>(undefined);

export function useCollapsibleRootContext() {
  const context = useContext(CollapsibleRootContext);
  if (context === undefined) {
    throw new Error(
      "LocalUI: CollapsibleRootContext is missing. Collapsible parts must be placed within the <Collapsible.Root>."
    );
  }

  return context;
}
