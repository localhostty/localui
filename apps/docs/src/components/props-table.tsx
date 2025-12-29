import { clientOnly } from "@solidjs/start";
import type { PropDefinition } from "./props-table-client";

const PropsTableClient = clientOnly(() => import("./props-table-client"));

export type { PropDefinition };

export function PropsTable(props: { props: PropDefinition[]; class?: string }) {
  return <PropsTableClient class={props.class} props={props.props} />;
}
