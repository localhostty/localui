import { createSignal, Index, type Component } from 'solid-js'
import { Button } from '../../src/button'
import { Accordion } from '../../src'

const App: Component = () => {
    return (
        <div class="p-3">
            <p class="text-4xl text-green-700 text-center py-20">Hello tailwind!</p>
            <Button class="border-2 px-3 py-2 rounded-xl border-neutral-500 hover:bg-neutral-200 active:bg-neutral-100">
                Test
            </Button>
            <DemoAccordion />
        </div>
    )
}

export function DemoAccordion() {
    const [data, _] = createSignal([
        {
            title: 'Accordion 1',
            content: 'Accordion 1 content',
        },
        {
            title: 'Accordion 2',
            content: 'Accordion 2 content',
        },
        {
            title: 'Accordion 3',
            content: 'Accordion 3 content',
        },
    ])
    const [open, setOpen] = createSignal<number | null>(null)

    return (
        <Accordion.Root open={open} setOpen={setOpen}>
            <Index each={data()}>
                {(item, index) => (
                    <Accordion.Item data-index={index}>
                        <Accordion.Trigger index={index}>{item().title}</Accordion.Trigger>
                        <Accordion.Content index={index}>{item().content}</Accordion.Content>
                    </Accordion.Item>
                )}
            </Index>
        </Accordion.Root>
    )
}

export default App
