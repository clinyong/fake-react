import { ReactComponent } from "./ReactComponent";

interface Obj {
  [index: string]: any;
}
export type ReactElementType = string | number | ReactComponent;
export type ReactChildType = ReactElement | string;
export interface ReactElementAttr extends Obj {
  children?: ReactChildType;
  key?: string;
}

export interface ReactElementProps {
  key?: string;
  type: ReactElementType;
  props: ReactElementAttr;
}

export class ReactElement implements ReactElementProps {
  key?: string;
  type: ReactElementType;
  props: ReactElementAttr;

  constructor(props: ReactElementProps) {
    this.key = props.key;
    this.type = props.type;
    this.props = props.props;
  }
}
