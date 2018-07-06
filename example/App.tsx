import * as React from "../src";

class App extends React.Component {
  onClick = () => {
    alert("haha");
  };

  render() {
    return <div onClick={this.onClick}>Hello World</div>;
  }
}

React.render(<App />, document.getElementById("root"));
