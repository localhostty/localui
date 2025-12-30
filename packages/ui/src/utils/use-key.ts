import {createEffect, createMemo, onCleanup } from "solid-js";

export interface useKeyProps<T extends HTMLElement> {
  key: string;
  action: () => any;
  ref?: Document | Window | T | ((el: T) => any) | any;
  options?: Record<string, string>;
}

export function useKey<T extends HTMLElement>(props: useKeyProps<T>) {
  const ref = createMemo(() => (props.ref ? props.ref : document));
  createEffect(() => {
    const handler = (keyEvent: KeyboardEvent) => {
      if (props.key === keyEvent.key) {
        props.action();
      }
    };

    // @ts-expect-error For some reason the typing doesn't find the events for HTMLElement...
    ref().addEventListener("keydown", (keyEvent) => handler(keyEvent));

    onCleanup(() => {
      // @ts-expect-error For some reason the typing doesn't find the events for HTMLElement...
      ref().removeEventListener("keydown", (keyEvent) => handler(keyEvent));
    });
  });
}

