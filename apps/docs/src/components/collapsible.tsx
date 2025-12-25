import { clientOnly } from "@solidjs/start";

const CollapsibleDemoClient = clientOnly(
  () => import("./collapsible-demo-client"),
);

export function CollapsibleDemo() {
  return <CollapsibleDemoClient />;
}
