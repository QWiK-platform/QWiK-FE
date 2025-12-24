import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Tooltip.css";

const Tooltip = ({
  children,
  content,
  position = "top",
  trigger = "hover",
  className = "",
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);

  // 비활성화되거나 내용이 없으면 children만 렌더링
  if (disabled || !content) {
    return children;
  }

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === "click") {
      setVisible(!visible);
    }
  };

  return (
    <div
      className={`tooltip-wrapper ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {visible && (
        <div className={`tooltip-content tooltip-${position}`}>{content}</div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  trigger: PropTypes.oneOf(["hover", "click"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Tooltip;
