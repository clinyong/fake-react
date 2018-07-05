import {
  ReactElement,
  ReactElementAttr,
  ReactElementType,
  ReactChildType
} from "./ReactElement";

export function createElement(
  type: ReactElementType,
  config: ReactElementAttr | null,
  ...children: ReactChildType[]
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

  return new ReactElement({
    key,
    type,
    props
  });
}
