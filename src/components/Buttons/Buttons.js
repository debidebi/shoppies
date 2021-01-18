import React from "react";
import styles from "./Button.module.css";


const Buttons = (props) => {
  return (
    <button
      onClick={props.click}
      disabled={props.disabled}
      className={props.added ? styles.BtnRemove : styles.BtnAdd}
    >
      {props.added ? <i className="fas fa-trash-alt"></i> : "Nominate"}
    </button>
  );
};

export default Buttons;
