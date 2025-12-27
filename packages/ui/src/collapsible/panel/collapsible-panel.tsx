import {
  type ComponentProps,
  createEffect,
  createMemo,
  splitProps,
} from "solid-js";
import { Presence } from "../../utils/presence";
import { useCollapsibleRootContext } from "../root/collapsible-root-context";

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  const [local, others] = splitProps(props, ["keepMounted", "id"]);
  const context = useCollapsibleRootContext()
  const { open, panelId, setPanelId, disabled, triggerId, transitionStatus, mounted,  } =
    context;
    let {animationTypeRef, transitionDimensionRef} = context;
  const keepMounted = createMemo(() => local.keepMounted ?? false);
  createEffect(() => {
    if (local.id && local.id !== panelId()) {
      setPanelId(local.id);
      if (local.id && local.id !== panelId()) {
        setPanelId(local.id);
      }
    }
  });
  const animationState = createMemo(() =>
     ({[`data-${transitionStatus()}`]: ""})
    )
const handlePanelRef = (element: HTMLElement) => {
    if (!element) {
      return undefined;
    }
    if (animationTypeRef == null || transitionDimensionRef == null) {
      const panelStyles = getComputedStyle(element);

      const hasAnimation = panelStyles.animationName !== 'none' && panelStyles.animationName !== '';
      const hasTransition =
        panelStyles.transitionDuration !== '0s' && panelStyles.transitionDuration !== '';

      /**
       * animationTypeRef is safe to read in render because it's only ever set
       * once here during the first render and never again.
       * https://react.dev/learn/referencing-values-with-refs#best-practices-for-refs
       */
      if (hasAnimation && hasTransition) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            'CSS transitions and CSS animations both detected on Collapsible or Accordion panel.',
            'Only one of either animation type should be used.',
          );
        }
      } else if (panelStyles.animationName === 'none' && panelStyles.transitionDuration !== '0s') {
        animationTypeRef = 'css-transition';
      } else if (panelStyles.animationName !== 'none' && panelStyles.transitionDuration === '0s') {
        animationTypeRef = 'css-animation';
      } else {
        animationTypeRef = 'none';
      }
    }
  }
  createEffect(() => console.log("TRANSITION STATE: ",transitionStatus()))
  createEffect(() => console.log("ANIMATION STATE: ",animationState()))
  createEffect(() => console.log("MOUNTED STATE: ",mounted()))
  const openProp = createMemo(() => open() || mounted())
  let panelRef: HTMLElement | null = null;
  createEffect(() =>{
    if(panelRef) {
      handlePanelRef(panelRef)
    }
  }, [open(), mounted(), local, others])

  return (
    <Presence
      as="div"
      id={panelId()}
      keepMounted={keepMounted}
      open={openProp}
      role="region"
      aria-labelledby={triggerId()}
      aria-hidden={!open() || undefined}
      ref={panelRef}
      {...others}
      data-closed={open() ? undefined : ""}
      data-open={open() ? "" : undefined}
      data-disabled={disabled() ? "" : undefined}
      {...animationState()}
    />
  );
}

export interface CollapsiblePanelProps extends ComponentProps<"div"> {
  keepMounted?: boolean;
}
