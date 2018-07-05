import * as React from "preact";

class App extends React.Component {
  render() {
    return React.h("div", null, "Hello World");
  }
}

React.render(React.h(App), document.getElementById("root"));
