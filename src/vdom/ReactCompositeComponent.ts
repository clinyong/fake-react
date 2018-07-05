import { ReactElement, ReactElementAttr } from "../ReactElement";
import { ReactComponent } from "../ReactComponent";
import { instantiateReactComponent } from "../instantiateReactComponent";
import { ComponentInstance } from "./ComponentInstance";

export class ReactCompositeComponent implements ComponentInstance {
  private currentElement: ReactElement;

  constructor(element: ReactElement) {
    this.currentElement = element;
  }

  private constructComponent(publicProps: ReactElementAttr) {
    let Component = this.currentElement.type as any;

    if (Component.isReactElement) {
      const inst: ReactComponent = new Component(publicProps);
      return inst.render();
    } else {
      // StatelessComponent
      return Component(publicProps);
    }
  }

  private performInitialMount(renderedElement: ReactElement) {
    const child = instantiateReactComponent(renderedElement);
    return child.mountComponent();
  }

  mountComponent() {
    const publicProps = this.currentElement.props;
    let renderedElement = this.constructComponent(publicProps);

    const markup = this.performInitialMount(renderedElement);
    return markup;
  }
}
