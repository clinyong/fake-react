import {
  ReactElement,
  ReactElementAttr,
  ReactElementType
} from "../ReactElement";
import { instantiateReactComponent } from "../instantiateReactComponent";
import { ComponentInstance } from "./ComponentInstance";
import { shouldUpdateReactComponent, getComponentKey } from "../utils";

enum ReactChildUpdateType {
  REMOVE_NODE,
  MOVE_EXISTING,
  INSERT_MARKUP,
  TEXT_CONTENT
}

interface UpdateTask {
  type: ReactChildUpdateType;
  fromIndex: number | null;
  node: HTMLElement | null;
  toIndex: number | null;
  afterNode: HTMLElement | null;
}

function initUpdateTask(task: Partial<UpdateTask>) {
  const defaultProps: Partial<UpdateTask> = {
    fromIndex: null,
    node: null,
    toIndex: null,
    afterNode: null
  };
  return Object.assign({}, defaultProps, task) as UpdateTask;
}

interface RenderedChildren {
  [index: string]: ComponentInstance;
}

function flatChildren(nextChildElements: ReactElement[] | ReactElement) {
  const children: any = {};

  [].concat(nextChildElements as any).forEach((item, index) => {
    children[getComponentKey(item, index)] = item;
  });

  return children;
}

/**
 * If afterNode exists, insert node after that.
 * If not, insert at the end of parentNode.
 */
function insertAfter(
  parentNode: Node,
  node: Node,
  afterNode: Node | null = null
) {
  parentNode.insertBefore(node, afterNode ? afterNode.nextSibling : null);
}

function createNextChildren(
  prevChildren: RenderedChildren,
  nextElementList: ReactElement[] | ReactElement
): { nextChildren: RenderedChildren; updateList: UpdateTask[] } {
  const nextChildElements: { [index: string]: ReactElement } = flatChildren(
    nextElementList
  );
  const nextChildComponents: RenderedChildren = {};

  const removedNodes: { [index: string]: HTMLElement } = {};
  const updateList: UpdateTask[] = [];

  // Convert next react element to component instance
  for (let name in nextChildElements) {
    if (!nextChildElements.hasOwnProperty(name)) {
      continue;
    }
    const prevChild = prevChildren && prevChildren[name];
    const prevElement = prevChild && prevChild.currentElement;
    const nextElement = nextChildElements[name];
    if (prevElement && shouldUpdateReactComponent(prevElement, nextElement)) {
      prevChild.receiveElement(nextElement);
      nextChildComponents[name] = prevChild;
    } else {
      if (prevChild) {
        removedNodes[name] = prevChild.getNativeNode()!;
        prevChild.unmountComponent();
      }

      // The child must be instantiated before it's mounted.
      const nextChildInstance = instantiateReactComponent(nextElement);
      nextChildComponents[name] = nextChildInstance;
    }
  }

  let nextIndex = 0;
  let preMaxIndex = 0; // 在 preChildren 访问的最大索引
  let lastNode: HTMLElement | null = null;
  for (let name in nextChildComponents) {
    if (!nextChildComponents.hasOwnProperty(name)) {
      continue;
    }

    const prevChild = prevChildren && prevChildren[name];
    const nextChild = nextChildComponents[name];

    nextChild.mountIndex = nextIndex;

    if (prevChild === nextChild) {
      if (prevChild.mountIndex < preMaxIndex) {
        updateList.push(
          initUpdateTask({
            type: ReactChildUpdateType.MOVE_EXISTING,
            node: prevChild.getNativeNode(),
            afterNode: lastNode
          })
        );
      }
    } else {
      updateList.push(
        initUpdateTask({
          type: ReactChildUpdateType.INSERT_MARKUP,
          toIndex: nextIndex,
          node: nextChild.mountComponent(),
          afterNode: lastNode
        })
      );
    }

    if (prevChild) {
      preMaxIndex = Math.max(prevChild.mountIndex, preMaxIndex);
    }

    lastNode = nextChild.getNativeNode();
    nextIndex++;
  }

  // remove child that is not in nextChildElements
  for (let name in prevChildren) {
    if (
      prevChildren.hasOwnProperty(name) &&
      !(nextChildElements && nextChildElements.hasOwnProperty(name))
    ) {
      const prevChild = prevChildren[name];
      removedNodes[name] = prevChild.getNativeNode()!;
      prevChild.unmountComponent();
    }
  }

  for (let name in removedNodes) {
    if (removedNodes.hasOwnProperty(name)) {
      updateList.push(
        initUpdateTask({
          type: ReactChildUpdateType.REMOVE_NODE,
          node: removedNodes[name]
        })
      );
    }
  }

  return {
    nextChildren: nextChildComponents,
    updateList
  };
}

export class ReactDOMComponent implements ComponentInstance {
  static displayName = "ReactDOMComponent";

  mountIndex: number;
  currentElement: ReactElement | null = null;
  private tag: string;
  private nativeNode: HTMLElement | null;
  private renderedChildren: RenderedChildren | null = null;

  constructor(element: ReactElement) {
    console.log("ReactDOMComponent");

    this.currentElement = element;
    this.tag = element.type as string;
  }

  private mountChildren(nestedChildren: ReactElementType) {
    const type = typeof nestedChildren;
    const children: RenderedChildren = {};
    const childList: ReactElement[] = [].concat(nestedChildren as any);

    childList.forEach((child, index) => {
      children[getComponentKey(child, index)] = instantiateReactComponent(
        child
      );
    });
    this.renderedChildren = children;

    const mountImages: HTMLElement[] = [];

    Object.keys(children).forEach((name, index) => {
      const child = children[name];
      child.mountIndex = index;
      mountImages.push(child.mountComponent());
    });

    return mountImages;
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
      case "object":
        contentToUse = this.mountChildren(children);
      default:
        break;
    }

    if (typeof contentToUse === "string") {
      lazyTree.textContent = contentToUse;
    } else if (Array.isArray(contentToUse)) {
      contentToUse.forEach(child => {
        lazyTree.appendChild(child);
      });
    }
  }

  private processChildUpdateList(updateList: UpdateTask[]) {
    const parentNode: HTMLElement = this.nativeNode!;

    updateList.forEach(task => {
      switch (task.type) {
        case ReactChildUpdateType.REMOVE_NODE:
          parentNode.removeChild(task.node!);
          break;
        case ReactChildUpdateType.INSERT_MARKUP:
        case ReactChildUpdateType.MOVE_EXISTING:
          insertAfter(parentNode, task.node!, task.afterNode);
          break;
        default:
          break;
      }
    });
  }

  private updateChildren(nextChildList: ReactElement[] | ReactElement) {
    const prevChildren = this.renderedChildren;
    // change array to object
    const nextChildren = flatChildren(nextChildList);

    if (!prevChildren && !nextChildren) {
      return;
    }

    const result = createNextChildren(prevChildren!, nextChildList);
    if (result.updateList.length > 0) {
      this.processChildUpdateList(result.updateList);
    }

    this.renderedChildren = result.nextChildren;
  }

  private updateDOMProps(
    preProps: ReactElementAttr | null,
    nextProps: ReactElementAttr
  ) {}

  private updateDOMChildren(
    preProps: ReactElementAttr | null,
    nextProps: ReactElementAttr
  ) {
    let preContent: string = "",
      nextContent: string = "";

    if (preProps && typeof preProps.children === "string") {
      preContent = preProps.children;
    }
    if (typeof nextProps.children === "string") {
      nextContent = nextProps.children;
    }

    let preChildren: ReactElement | null | undefined = preContent
      ? null
      : preProps && (preProps.children as ReactElement);
    let nextChildren: ReactElement | undefined = nextContent
      ? null
      : (nextProps.children as any);

    if (preChildren !== null && nextChildren === null) {
      // Remove pre children
      this.updateChildren([]);
    }

    if (nextContent) {
      if (nextContent !== preContent) {
        this.nativeNode!.textContent = nextContent;
      }
    } else if (nextChildren) {
      this.updateChildren(nextChildren);
    }
  }

  receiveElement(element: ReactElement) {
    const prevElement = this.currentElement;
    this.currentElement = element;

    this.updateComponent(prevElement, element);
  }

  performComponentUpdate() {}

  /**
   * Updates a native DOM component after it has already been allocated and
   * attached to the DOM.
   */
  updateComponent(preElement: ReactElement | null, nextElement: ReactElement) {
    const prevProps = preElement && preElement.props;
    this.updateDOMProps(prevProps, nextElement.props);
    this.updateDOMChildren(prevProps, nextElement.props);
  }

  mountComponent() {
    const el = document.createElement(this.tag);
    const props = this.currentElement!.props;

    this.createInitialChildren(props, el);

    const obj = Object.assign({}, props);
    delete obj.children;

    // add event
    Object.keys(obj).forEach(p => {
      if (p.startsWith("on")) {
        const evtName = p.replace("on", "").toLowerCase();
        el.addEventListener(evtName, obj[p]);
      }
    });

    this.nativeNode = el;
    return el;
  }

  /**
   * Receives a next element and updates the component.
   */
  receiveComponent(nextElement: ReactElement) {
    const preElement = this.currentElement;
    this.currentElement = nextElement;

    this.updateComponent(preElement, nextElement);
  }

  private unmountChildren() {
    if (this.renderedChildren) {
      const renderedChildren = this.renderedChildren;
      Object.keys(renderedChildren).forEach(k => {
        renderedChildren[k].unmountComponent();
      });
      this.renderedChildren = null;
    }
  }

  unmountComponent() {
    this.unmountChildren();
    this.currentElement = null;
    this.tag = "";
    this.nativeNode = null;
    this.renderedChildren = null;
  }

  getNativeNode() {
    return this.nativeNode;
  }
}
