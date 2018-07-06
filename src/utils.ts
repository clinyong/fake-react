import { ReactElementType, ReactElement } from "./ReactElement";

/**
 * If return true, call pre child component.receiveElement to update component element.
 * If return false, destroy pre child component, and rebuild the next component for next element.
 */
export function shouldUpdateReactComponent(
  prevElement: ReactElementType,
  nextElement: ReactElementType
): boolean {
  const prevEmpty = prevElement === null || prevElement === false;
  const nextEmpty = nextElement === null || nextElement === false;
  if (prevEmpty || nextEmpty) {
    return prevEmpty === nextEmpty;
  }

  const prevType = typeof prevElement;
  const nextType = typeof nextElement;

  if (nextType === "string" && prevType === "string") {
    return true;
  } else if (nextType === "object" && prevType === "object") {
    const nextChildElement: ReactElement = nextElement as any;
    const preChildElement: ReactElement = prevElement as any;

    return (
      nextChildElement.type === preChildElement.type &&
      nextChildElement.key === preChildElement.key
    );
  }

  return false;
}

export function getComponentKey(element: ReactElement, index: number) {
  if (element && element.key) {
    return "$" + element.key;
  }

  return index.toString(36);
}
