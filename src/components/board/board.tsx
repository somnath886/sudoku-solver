import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/store.root";
import Cell from "../cell/cell";
import styles from "./board.module.css";

const Board: React.FC = () => {
  const board = useSelector((state: RootState) => state.board);
  return (
    <div className={styles.container}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.cell_container}>
          {row.map((cell, cellIndex) => (
            <Cell value={cell} x={rowIndex} y={cellIndex} key={cellIndex} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
