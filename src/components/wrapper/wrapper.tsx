import React from "react";

import styles from "./wrapper.module.css";
import Board from "../board/board";
import Button from "../button/button";

const Wrapper: React.FC = () => {
  return (
    <div className={styles.container}>
      <Board />
      <Button />
    </div>
  );
};

export default Wrapper;
