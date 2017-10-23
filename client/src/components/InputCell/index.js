import React, { Component } from "react";

import Input from "../Input";

/**
 * Cell containing input component
 */

class InputCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  onChange(value) {
    // save cell value inside component
    this.setState({ value });
    // call onChange from Row component
    this.props.onChange(value);
  }

  onKeyUp(e) {
    if (this.props.onKeyUp) this.props.onKeyUp(e, this.props.id); // call only if is value cell
  }

  render() {
    const props = {
      id: this.state.id,
      onChange: this.onChange,
      type: this.props.type,
      onKeyUp: this.onKeyUp,
      value: this.props.value
    };

    return (
      <div className="cell" style={this.props.style}>
        <Input {...props} />
      </div>
    );
  }
}

export default InputCell;
