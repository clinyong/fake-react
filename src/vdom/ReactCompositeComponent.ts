import { ReactElement, ReactElementAttr } from "../ReactElement";
import { ReactComponent } from "../ReactComponent";
import { instantiateReactComponent } from "../instantiateReactComponent";
import { ComponentInstance } from "./ComponentInstance";

export class ReactCompositeComponent implements ComponentInstance {
  private currentElement: ReactElement;
  private instance: ReactComponent;
  private renderedChildren: ComponentInstance;

  constructor(element: ReactElement) {
    this.currentElement = element;

    // construct self
    this.instance = this.constructSelf(element.props);

    // construct children
    this.renderedChildren = instantiateReactComponent(
      this.instance.render() as any
    );
  }

  private constructSelf(publicProps: ReactElementAttr) {
    let Component = this.currentElement.type as any;
    return new Component(publicProps);
  }

  mountComponent() {
    return this.renderedChildren.mountComponent();
  }
}
