import { type Component, createSignal, Index } from "solid-js";
// biome-ignore lint/performance/noNamespaceImport: You can ignore it here
import * as Accordion from "../../src/accordion/accordion";
import { Button } from "../../src/button/button";

const App: Component = () => {
  return (
    <div class="p-3">
      <p class="py-20 text-center text-4xl text-green-700">Hello tailwind!</p>
      <Button class="rounded-xl border-2 border-neutral-500 px-3 py-2 hover:bg-neutral-200 active:bg-neutral-100">
        Test
      </Button>
      <DemoAccordion />
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
  const [open, setOpen] = createSignal<number | null>(null);

  return (
    <Accordion.Root open={open} setOpen={setOpen}>
      <Index each={data()}>
        {(item, index) => (
          <Accordion.Item data-index={index}>
            <Accordion.Trigger index={index}>{item().title}</Accordion.Trigger>
            <Accordion.Content index={index}>
              {item().content}
            </Accordion.Content>
          </Accordion.Item>
        )}
      </Index>
    </Accordion.Root>
  );
}

export default App;
