import {
  ReactElement,
  ReactElementAttr,
  ReactComponentType,
  ReactElementType
} from "./ReactElement";

export function createElement(
  type: ReactComponentType,
  config: ReactElementAttr | null,
  ...children: ReactElementType[]
): ReactElement {
  const props: ReactElementAttr = {};
  let key: string = "";

  if (config) {
    Object.keys(config).forEach((k: string) => {
      props[k] = config[k];
    });

    if (props.key) {
      key = props.key;
      delete props.key;
    }
  }

  // 暂时只接受第一个子元素
  props.children = children[0];

  if (typeof props.children === "number") {
    props.children = props.children!.toString();
  }

  return new ReactElement({
    key,
    type,
    props
  });
}
