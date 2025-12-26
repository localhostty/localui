/** biome-ignore-all lint/style/noNonNullAssertion: doesn't matter here */
/** biome-ignore-all lint/suspicious/noExplicitAny: it's fine given the function */
import {
  type Accessor,
  createEffect,
  createMemo,
  createSignal,
  type Setter,
} from "solid-js";

interface UseControllableStateParams<T> {
  prop?: Accessor<T | undefined>;
  defaultProp: Accessor<T>;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>): [Accessor<T>, Setter<T>] {
  const isControlled = createMemo(() => prop?.() !== undefined);
  const [uncontrolledValue, setUncontrolledValue] = useUncontrolledState({
    defaultProp,
    onChange,
  });
  const value = createMemo(() =>
    isControlled() ? prop!()! : uncontrolledValue(),
  );

  // @ts-expect-error
  const setValue: Setter<T> = (value) => {
    if (isControlled()) {
      const currentValue = prop!()!;
      const newValue = isFunction(value) ? (value(currentValue) as any) : value;

      if (newValue !== currentValue && onChange) {
        onChange(newValue);
      }
    } else if (value !== undefined) {
      setUncontrolledValue(value);
    }
  };

  return [value, setValue];
}

export function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<UseControllableStateParams<T>, "prop">): [Accessor<T>, Setter<T>] {
  const [value, setValue] = createSignal(defaultProp());

  let prevValue: T | undefined;

  createEffect(() => {
    const next = value();
    const currentOnChange = onChange;

    if (prevValue !== undefined && prevValue !== next && currentOnChange) {
      currentOnChange(next);
    }

    prevValue = next;
  });

  return [value, setValue];
}

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === "function";
}
