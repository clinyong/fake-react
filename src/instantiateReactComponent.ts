import { ReactElement } from "./ReactElement";
import { ReactCompositeComponent } from "./vdom/ReactCompositeComponent";
import { ReactDOMComponent } from "./vdom/ReactDOMComponent";
import { ComponentInstance } from "./vdom/ComponentInstance";

export function instantiateReactComponent(
  node: ReactElement
): ComponentInstance {
  let instance: ReactCompositeComponent | ReactDOMComponent | null = null;

  if (typeof node.type === "function") {
    instance = new ReactCompositeComponent(node);
  } else if (typeof node.type === "string") {
    instance = new ReactDOMComponent(node);
  }

  if (!instance) {
    throw new Error("Unknown node type");
  }

  return instance;
}
