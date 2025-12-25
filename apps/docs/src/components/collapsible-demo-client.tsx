import { Button } from "@local/ui/button";
import { Collapsible } from "@local/ui/collapsible";
import { createSignal } from "solid-js"

export default function CollapsibleDemoClient() {
  return (
    <>
    <Collapsible.Root>
      <Collapsible.Trigger  style="width: 250px;">
        Press here!
      </Collapsible.Trigger>
      <Collapsible.Panel
        style="width: 250px; border: 2px solid black; padding: 4px; margin-top: 4px;"
      >
        And this text will be shown!
      </Collapsible.Panel>
    </Collapsible.Root>
</>
  );
}
