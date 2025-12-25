import { createUniqueId } from "solid-js";

export function createUniqueLocalId() {
  return `local_ui_${createUniqueId()}`;
}
