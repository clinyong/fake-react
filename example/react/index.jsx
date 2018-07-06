import * as React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }

  add() {
    this.setState({
      count: this.state.count + 1
    });
  }

  render() {
    return <div onClick={this.add.bind(this)}>{this.state.count}</div>;
  }
}

React.render(<App />, document.getElementById("root"));
