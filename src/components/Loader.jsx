import React from "react";
import PropTypes from "prop-types";
import "./Loader.css";

const Loader = ({ text = "정보를 불러오는 중" }) => {
  return (
    <div className="loader-container">
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

Loader.propTypes = {
  text: PropTypes.string,
};

export default Loader;
