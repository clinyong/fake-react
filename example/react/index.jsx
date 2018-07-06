import * as React from "react";
import * as ReactDOM from "react-dom";

class ListItem extends React.Component {
  componentWillUnmount() {
    console.log(`${this.props.children} is unmount.`);
  }

  render() {
    return <li>{this.props.children}</li>;
  }
}

const list1 = [1, 2, 3, 4, 5];
const list2 = [3, 2, 5, 1, 4];

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: false
    };
  }

  add() {
    this.setState({
      list: [Math.random() + this.state.list.length + 1].concat(this.state.list)
    });
  }

  reverse() {
    this.setState({
      toggle: !this.state.toggle
    });
  }

  render() {
    const list = this.state.toggle ? list1 : list2;
    return (
      <ul onClick={this.reverse.bind(this)}>
        {list.map(item => <li key={item.toString()}>{item}</li>)}
      </ul>
    );
  }
}

class ComponentA extends React.Component {
  render() {
    return <span>A</span>;
  }
}

class ComponentB extends React.Component {
  render() {
    return <span>B</span>;
  }
}

class DifferentComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: false
    };
  }

  toggle() {
    this.setState({
      toggle: !this.state.toggle
    });
  }

  render() {
    return (
      <div onClick={this.toggle.bind(this)}>
        {this.state.toggle ? <div>A</div> : <p>B</p>}
      </div>
    );
  }
}

class Simple extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}

ReactDOM.render(<List />, document.getElementById("root"));
