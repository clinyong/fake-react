import { ReactElement } from "../ReactElement";

export interface ComponentInstance {
  mountIndex: number;
  currentElement: ReactElement | null;
  // Destroy and rebuild.
  receiveElement(element: ReactElement): void;
  mountComponent(): HTMLElement;
  updateComponent(
    preElement: ReactElement | null,
    nextElement: ReactElement
  ): void;
  unmountComponent(): void;
  performComponentUpdate(): void;
  getNativeNode(): HTMLElement | null;
}
