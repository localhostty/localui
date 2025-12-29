import { Collapsible } from "@local/ui/collapsible";
import { type ComponentProps, For, type JSX } from "solid-js";

// Types for props table data
export interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description?: string;
}

export interface PropsTableProps {
  props: PropDefinition[];
  class?: string;
}

// Chevron icon for collapsible rows
function ChevronIcon(props: ComponentProps<"svg">) {
  return (
    <svg fill="none" height="10" viewBox="0 0 10 10" width="10" {...props}>
      <path d="M3.5 9L7.5 5L3.5 1" stroke="currentcolor" stroke-width="1.5" />
    </svg>
  );
}

// Composable Table Parts
export function TableRoot(props: { children: JSX.Element; class?: string }) {
  return (
    <div
      class={`w-full overflow-hidden rounded-lg border border-zinc-300 bg-white ${props.class ?? ""}`}
    >
      {props.children}
    </div>
  );
}

export function TableHead(props: { children: JSX.Element }) {
  return (
    <div class="grid grid-cols-[1fr_1.5fr_0.8fr] border-b border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-700">
      {props.children}
    </div>
  );
}

export function TableHeadCell(props: { children: JSX.Element }) {
  return <div class="px-2">{props.children}</div>;
}

export function TableBody(props: { children: JSX.Element }) {
  return <div class="divide-y divide-zinc-200">{props.children}</div>;
}

// Collapsible Row Component
export function TableRow(props: { prop: PropDefinition }) {
  return (
    <Collapsible.Root class="group/row">
      <Collapsible.Trigger class="group grid w-full cursor-pointer grid-cols-[1fr_1.5fr_0.8fr] items-center px-4 py-3 text-left text-sm transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:-outline-offset-2">
        <div class="flex items-center gap-2 px-2">
          <ChevronIcon class="size-3 shrink-0 text-zinc-400 transition-all ease-out group-data-panel-open:rotate-90 duration-150" />
          <code class="font-mono text-sm text-zinc-900">{props.prop.name}</code>
        </div>
        <div class="px-2">
          <code class="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-xs text-rose-600">
            {props.prop.type}
          </code>
        </div>
        <div class="px-2 text-zinc-500">{props.prop.default ?? "—"}</div>
      </Collapsible.Trigger>

      <Collapsible.Panel class="overflow-hidden border-t border-zinc-100 bg-zinc-50/50 transition-all duration-200 ease-out data-ending:h-0 data-starting:h-0 [&[hidden]:not([hidden='until-found'])]:hidden">
        <div class="space-y-3 px-6 py-4">
          <div class="grid grid-cols-[100px_1fr] gap-2 text-sm">
            <span class="font-medium text-zinc-600">Name</span>
            <code class="font-mono text-zinc-900">{props.prop.name}</code>
          </div>
          {props.prop.description && (
            <div class="grid grid-cols-[100px_1fr] gap-2 text-sm">
              <span class="font-medium text-zinc-600">Description</span>
              <span class="text-zinc-700">{props.prop.description}</span>
            </div>
          )}
          <div class="grid grid-cols-[100px_1fr] gap-2 text-sm">
            <span class="font-medium text-zinc-600">Type</span>
            <code class="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-xs text-rose-600 w-fit">
              {props.prop.type}
            </code>
          </div>
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

// Full Props Table Component
export default function PropsTableClient(props: PropsTableProps) {
  return (
    <TableRoot class={props.class}>
      <TableHead>
        <>
          <TableHeadCell>
            <>Prop</>
          </TableHeadCell>
          <TableHeadCell>
            <>Type</>
          </TableHeadCell>
          <TableHeadCell>
            <>Default</>
          </TableHeadCell>
        </>
      </TableHead>
      <TableBody>
        <For each={props.props}>{(prop) => <TableRow prop={prop} />}</For>
      </TableBody>
    </TableRoot>
  );
}

// Helper function to generate props table from JSON
export function generatePropsFromJson(
  json: PropDefinition[],
): PropDefinition[] {
  return json.map((item) => ({
    name: item.name,
    type: item.type,
    default: item.default,
    description: item.description,
  }));
}
