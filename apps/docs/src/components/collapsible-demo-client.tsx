import { Collapsible } from "@local/ui/collapsible";

export default function CollapsibleDemoClient() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>Press here!</Collapsible.Trigger>
      <Collapsible.Panel>And this text will be shown!</Collapsible.Panel>
    </Collapsible.Root>
  );
}
