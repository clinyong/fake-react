import { ReactComponent } from "./ReactComponent";
import { ComponentInstance } from "./vdom/ComponentInstance";

export class ReactUpdater {
  private dirtyComponents: ReactComponent[] = [];
  private updating: boolean = false;

  constructor() {
    this.flushBatchedUpdates = this.flushBatchedUpdates.bind(this);
  }

  enqueue(c: ReactComponent) {
    this.dirtyComponents.push(c);
    Promise.resolve().then(this.flushBatchedUpdates);
  }

  flushBatchedUpdates() {
    if (!this.updating) {
      this.updating = true;

      const dirtyComponents = this.dirtyComponents;
      this.dirtyComponents = [];

      while (dirtyComponents.length) {
        const c: ReactComponent = dirtyComponents.pop()!;
        c._reactInternalInstance.performComponentUpdate();
      }

      this.updating = false;
    }
  }
}

export const reactUpdater = new ReactUpdater();
