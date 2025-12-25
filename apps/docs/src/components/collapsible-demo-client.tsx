import { Collapsible } from "@local/ui/collapsible";

export default function CollapsibleDemoClient() {
  return (
    <Collapsible.Root disabled={() => true}>
      <Collapsible.Trigger style="width: 250px;">Press here!</Collapsible.Trigger>
      <Collapsible.Panel keepMounted={true} style="width: 250px; border: 2px solid black; padding: 4px; margin-top: 4px;">And this text will be shown!</Collapsible.Panel>
    </Collapsible.Root>
  );
}
