import {
  type Accessor,
  createContext,
  type Setter,
  useContext,
} from "solid-js";
import type { CollapsibleRoot } from "./collapsible-root";
import type { TransitionStatus } from "../../utils/use-transition-status";
import { useCollapsibleRoot } from "./use-collapsible-root";

export interface CollapsibleRootContext extends Omit<
  CollapsibleRoot.State,
  "disabled" | "open"
>, useCollapsibleRoot.ReturnValue {
  open: Accessor<boolean>;
  mounted: Accessor<boolean>;
  onOpenChange: Setter<boolean>;
  disabled: Accessor<boolean>;
  panelId: Accessor<string>;
  setPanelId: Setter<string>;
  triggerId: Accessor<string>;
  setTriggerId: Setter<string>;
  transitionStatus: Accessor<TransitionStatus>;
  handleTrigger: (...args: any) => any
}

export const CollapsibleRootContext = createContext<
  CollapsibleRootContext | undefined
>(undefined);

export function useCollapsibleRootContext() {
  const context = useContext(CollapsibleRootContext);
  if (context === undefined) {
    throw new Error(
      "LocalUI: CollapsibleRootContext is missing. Collapsible parts must be placed within the <Collapsible.Root>.",
    );
  }

  return context;
}
