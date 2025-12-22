/* eslint-disable no-unused-vars */
import * as Solid from 'solid-js'

type AccordionProps = Solid.ComponentProps<'div'> & {
    open: Solid.Accessor<number | null>
    setOpen: Solid.Setter<number | null>
}

const AccordionContext = Solid.createContext<AccordionProps>({
    open: () => null,
    setOpen: () => {},
})

export type AccordionRootProps = Solid.ComponentProps<'div'> & {
    open: Solid.Accessor<number | null>
    setOpen: Solid.Setter<number | null>
}

export const Root = (props: AccordionRootProps) => {
    const [splitProps, rest] = Solid.splitProps(props, ['children', 'open', 'setOpen'])

    const contextValue = Solid.createMemo(
        () => ({
            open: splitProps.open,
            setOpen: splitProps.setOpen,
        }),
        undefined,
    )

    return (
        <AccordionContext.Provider value={contextValue()}>
            <div {...rest}>{splitProps.children}</div>
        </AccordionContext.Provider>
    )
}

export type AccordionItemProps = Solid.ComponentProps<'div'>

export const Item = (props: AccordionItemProps) => <div {...props} />

export type AccordionTriggerProps = Solid.ComponentProps<'button'> & {
    index: number
    asChild?: boolean
}

export const Trigger = ({ asChild, index, ...props }: AccordionTriggerProps) => {
    const { open, setOpen } = Solid.useContext(AccordionContext)

    return <button onClick={() => setOpen(open() == index ? null : index)} {...props} />
}

export type AccordionContentProps = Solid.ComponentProps<'div'> & {
    index: number
    asChild?: boolean
}

export const Content = ({ asChild, index, ...props }: AccordionContentProps) => {
    const { open } = Solid.useContext(AccordionContext)

    return (
        <div
            {...props}
            style={{
                display: open() == index ? 'block' : 'none',
            }}
            data-state={open() == index ? 'open' : 'hidden'}
        />
    )
}
