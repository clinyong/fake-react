import { ReactElement } from "./ReactElement";
import { instantiateReactComponent } from "./instantiateReactComponent";

export function render(ele: ReactElement, container: HTMLElement | null) {
  if (!container) {
    return;
  }

  const ins = instantiateReactComponent(ele);
  container.appendChild(ins.mountComponent());
}
