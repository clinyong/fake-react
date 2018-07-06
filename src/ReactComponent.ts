import { ReactElement, ReactElementAttr } from "./ReactElement";
import { reactUpdater } from "./ReactUpdater";
import { ComponentInstance } from "./vdom/ComponentInstance";

export interface ReactComponent<P = {}, S = {}> {
  shouldComponentUpdate?(nextState: S): boolean;
  componentWillUnmount?(): void;
  render(): ReactElement | false | null;
}

export class ReactComponent<P = {}, S = {}> {
  static isReactElement = true;

  _reactInternalInstance: ComponentInstance;

  state: S;
  pendingState: S;
  props: P;

  setState(partialState: Partial<S>) {
    const originState: S = this.pendingState || this.state || ({} as any);
    this.pendingState = Object.assign({}, originState, partialState);

    reactUpdater.enqueue(this);
  }
}

export interface StatelessComponent {
  (props: ReactElementAttr, context?: any): ReactElement;
  defaultProps?: Partial<any>;
  displayName?: string;
}
