import { JSX } from "solid-js";

export function mergeStyles(
  other: JSX.CSSProperties,
  style?: JSX.CSSProperties | string,
): string | JSX.CSSProperties {
  if (typeof style === "string") {
    return `${style};${JSON.stringify(other)}`;
  } else if (typeof style !== "string") {
    return { ...style, ...other };
  } else {
    return other;
  }
}
