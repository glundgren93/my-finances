import React, { Component } from "react";

/**
 * Renders input based on received props
 */
class Input extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  onChange(e) {
    // call onChange from Cell component
    this.props.onChange(e.target.value);
  }

  onKeyUp(e) {
    this.props.onKeyUp(e);
  }

  handleFocus(event) {
    event.target.select();
  }

  render() {
    let { value } = this.props;
    return (
      <input
        type={this.props.type}
        onKeyUp={this.onKeyUp}
        onFocus={this.handleFocus}
        onInput={this.onChange}
        defaultValue={value}
      />
    );
  }
}

export default Input;
