/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import type { Accessor, ComponentProps, Setter } from "solid-js";
import { createContext, createMemo, splitProps, useContext } from "solid-js";

type AccordionProps = ComponentProps<"div"> & {
  open: Accessor<number | null>;
  setOpen: Setter<number | null>;
};

const AccordionContext = createContext<AccordionProps>({
  open: () => null,
  setOpen: () => null,
});

export type AccordionRootProps = ComponentProps<"div"> & {
  open: Accessor<number | null>;
  setOpen: Setter<number | null>;
};

export const Root = (props: AccordionRootProps) => {
  const [others, rest] = splitProps(props, ["children", "open", "setOpen"]);

  const contextValue = createMemo(
    () => ({
      open: others.open,
      setOpen: others.setOpen,
    }),
    undefined,
  );

  return (
    <AccordionContext.Provider value={contextValue()}>
      <div {...rest}>{others.children}</div>
    </AccordionContext.Provider>
  );
};

export type AccordionItemProps = ComponentProps<"div">;

export const Item = (props: AccordionItemProps) => <div {...props} />;

export type AccordionTriggerProps = ComponentProps<"button"> & {
  index: number;
  asChild?: boolean;
};

export const Trigger = (props: AccordionTriggerProps) => {
  const [others, rest] = splitProps(props, ["asChild", "index"]);
  const { open, setOpen } = useContext(AccordionContext);

  return (
    <button
      onClick={() => setOpen(open() === others.index ? null : others.index)}
      {...rest}
    />
  );
};

export type AccordionContentProps = ComponentProps<"div"> & {
  index: number;
  asChild?: boolean;
};

export const Content = (props: AccordionContentProps) => {
  const [others, rest] = splitProps(props, ["asChild", "index"]);
  const { open } = useContext(AccordionContext);

  return (
    <div
      {...rest}
      data-state={open() === others.index ? "open" : "hidden"}
      style={{
        display: open() === others.index ? "block" : "none",
      }}
    />
  );
};
