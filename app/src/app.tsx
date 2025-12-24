import { type Component, createSignal, Index } from "solid-js";
import { Button } from "../../src/button/button";
import { Collapsible } from "../../src/collapsible";
import { Slot } from "../../src/slot/slot";

const App: Component = () => {
  const [open, setOpen] = createSignal(false);
  return (
    <div class="p-3">
      <p class="py-20 text-center text-4xl text-green-700">Hello tailwind!</p>
      <Button class="rounded-xl border-2 border-neutral-500 px-3 py-2 hover:bg-neutral-200 active:bg-neutral-100">
        Test
      </Button>
      <DemoAccordion />
      <Slot as="test">test</Slot>
      <Collapsible.Root onOpenChange={setOpen} open={open}>
        <Collapsible.Trigger>Test</Collapsible.Trigger>
        <Collapsible.Panel>Content</Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
};

export function DemoAccordion() {
  const [data, _] = createSignal([
    {
      title: "Accordion 1",
      content: "Accordion 1 content",
    },
    {
      title: "Accordion 2",
      content: "Accordion 2 content",
    },
    {
      title: "Accordion 3",
      content: "Accordion 3 content",
    },
  ]);
  return (
    <Index each={data()}>
      {(item, _) => (
        <Collapsible.Root>
          <Collapsible.Trigger>{item().title}</Collapsible.Trigger>
          <Collapsible.Panel>{item().content}</Collapsible.Panel>
        </Collapsible.Root>
      )}
    </Index>
  );
}

export default App;
