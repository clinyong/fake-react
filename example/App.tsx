import * as React from "../src/index";

interface AppState {
  count: number;
}

class App extends React.Component<{}, AppState> {
  constructor() {
    super();

    this.state = {
      count: 0
    };
  }

  onClick = () => {
    this.setState({
      count: this.state.count + 1
    });
  };

  render() {
    return <div onClick={this.onClick}>{this.state.count}</div>;
  }
}

class Toggle extends React.Component<{}, any> {
  constructor() {
    super();

    this.state = {
      toggle: false
    };
  }

  onClick = () => {
    this.setState({
      toggle: !this.state.toggle
    });
  };

  render() {
    return (
      <div onClick={this.onClick}>
        {this.state.toggle ? <div>1</div> : <p>2</p>}
      </div>
    );
  }
}

class AddList extends React.Component<{}, any> {
  constructor() {
    super();

    this.state = {
      list: [1, 2, 3]
    };
  }

  add = () => {
    this.setState({
      list: this.state.list.concat(this.state.list.length + 1)
    });
  };

  render() {
    return (
      <ul onClick={this.add}>{this.state.list.map(item => <li>{item}</li>)}</ul>
    );
  }
}

const list1 = [1, 2, 3, 4, 5];
const list2 = [3, 2, 5, 1, 4];
class ToggleList extends React.Component<{}, any> {
  constructor() {
    super();

    this.state = {
      toggle: false
    };
  }

  onClick = () => {
    this.setState({
      toggle: !this.state.toggle
    });
  };

  render() {
    const list = this.state.toggle ? list1 : list2;
    return <ul onClick={this.onClick}>{list.map(item => <li>{item}</li>)}</ul>;
  }
}

React.render(<ToggleList />, document.getElementById("root"));
