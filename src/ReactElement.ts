import { ReactComponent } from "./ReactComponent";

interface Obj {
  [index: string]: any;
}
export type ReactComponentType = string | number | ReactComponent;
export type ReactElementType = ReactElement | string | false;
export interface ReactElementAttr extends Obj {
  children?: ReactElementType;
  key?: string;
}

export interface ReactElementProps {
  key?: string;
  type: ReactComponentType;
  props: ReactElementAttr;
}

export class ReactElement implements ReactElementProps {
  key?: string;
  type: ReactComponentType;
  props: ReactElementAttr;

  constructor(props: ReactElementProps) {
    this.key = props.key;
    this.type = props.type;
    this.props = props.props;
  }
}
