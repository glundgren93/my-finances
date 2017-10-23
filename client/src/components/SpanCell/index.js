import React from "react";

/**
 * Cell containing strong with text received from props
 * @type {Object}
 */
const SpanCell = ({ text, className, style }) => {
  return (
    <div className={className} style={style}>
      <span>{text}</span>
    </div>
  );
};

export default SpanCell;
