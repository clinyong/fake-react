import {
  ReactElement,
  ReactElementAttr,
  ReactChildType
} from "../ReactElement";
import { instantiateReactComponent } from "../instantiateReactComponent";
import { ComponentInstance } from "./ComponentInstance";

export class ReactDOMComponent implements ComponentInstance {
  static displayName = "ReactDOMComponent";

  private currentElement: ReactElement;
  private tag: string;

  constructor(element: ReactElement) {
    const tag = element.type as string;
    this.currentElement = element;
    this.tag = tag.toLowerCase();
  }

  private mountChildren(nestedChildren: ReactChildType) {
    const type = typeof nestedChildren;
    if (type === "undefined" || type === "boolean") {
      return "";
    } else {
      return []
        .concat(nestedChildren as any)
        .map((child: ReactElement) => instantiateReactComponent(child))
        .map((component: any) => component.mountComponent());
    }
  }

  private createInitialChildren(
    props: ReactElementAttr,
    lazyTree: HTMLElement
  ) {
    let contentToUse: string | null | HTMLElement[] = null;
    const children: any = props.children;

    switch (typeof children) {
      case "string":
        contentToUse = children;
        break;
      case "number":
        contentToUse = "" + children;
        break;
      case "function":
        contentToUse = this.mountChildren(children);
      default:
        break;
    }

    if (typeof contentToUse === "string") {
      lazyTree.textContent = contentToUse;
    } else if (Array.isArray(contentToUse)) {
      for (let child of contentToUse) {
        lazyTree.appendChild(child);
      }
    }
  }

  mountComponent() {
    const el = document.createElement(this.tag);
    this.createInitialChildren(this.currentElement.props, el);
    return el;
  }
}
