import { ReactElement, ReactElementAttr } from "../ReactElement";
import { ReactComponent } from "../ReactComponent";
import { instantiateReactComponent } from "../instantiateReactComponent";
import { ComponentInstance } from "./ComponentInstance";
import { shouldUpdateReactComponent } from "../utils";

export class ReactCompositeComponent implements ComponentInstance {
  currentElement: ReactElement | null;
  mountIndex: number;
  private instance: ReactComponent | null;
  // react15 里面，renderedComponent 不可能为数组
  private renderedComponent: ComponentInstance | null;

  constructor(element: ReactElement) {
    this.receiveElement(element);
  }

  private constructSelf(publicProps: ReactElementAttr) {
    let Component = this.currentElement!.type as any;
    return new Component(publicProps);
  }

  receiveElement(nextElement: ReactElement) {
    this.currentElement = nextElement;

    // construct self
    this.instance = this.constructSelf(nextElement.props);
    this.instance!._reactInternalInstance = this;

    // construct children
    this.renderedComponent = instantiateReactComponent(
      this.instance!.render() as any
    );
  }

  updateComponent(nextElement: ReactElement) {}

  // 只有 composite component 才有这个方法
  performComponentUpdate() {
    const inst: ReactComponent = this.instance!;
    const nextState = inst.pendingState;
    const shouldUpdate =
      !inst.shouldComponentUpdate || inst.shouldComponentUpdate(nextState);

    inst.state = inst.pendingState;

    if (shouldUpdate) {
      const prevRenderedElement = this.renderedComponent!.currentElement!;
      const nextRenderedElement = inst.render()!;

      if (
        shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)
      ) {
        this.renderedComponent!.updateComponent(
          prevRenderedElement,
          nextRenderedElement as ReactElement
        );
      } else {
        // Destroy the old child instance and rebuild the new one.
      }
    }
  }

  mountComponent() {
    return this.renderedComponent!.mountComponent();
  }

  unmountComponent() {
    if (!this.renderedComponent) {
      return;
    }

    const inst = this.instance!;
    if (inst.componentWillUnmount) {
      inst.componentWillUnmount();
    }

    this.renderedComponent.unmountComponent();
    this.currentElement = null;
    this.instance = null;
    this.renderedComponent = null;
  }

  getNativeNode() {
    return this.renderedComponent!.getNativeNode();
  }
}
