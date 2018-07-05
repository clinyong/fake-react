import { ReactElement, ReactElementAttr } from "./ReactElement";

export abstract class ReactComponent {
  static isReactElement = true;
  abstract render(): ReactElement | false | null;
}

export interface StatelessComponent {
  (props: ReactElementAttr, context?: any): ReactElement;
  defaultProps?: Partial<any>;
  displayName?: string;
}
