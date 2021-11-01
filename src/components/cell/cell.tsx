import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/store.root";
import styles from "./cell.module.css";
import useCustomHooks from "./useCustomHooks";

interface IProps {
  value: number;
  x: number;
  y: number;
}

const borders = (x: number, y: number) => {
  return {
    borderRight: (y === 2 || y === 5) && "1px solid black",
    borderBottom: (x === 2 || x === 5) && "1px solid black",
  };
};

const cellColors = [
  "#FFFFFF",
  "#3705FF",
  "#B405FF",
  "#FF0550",
  "#CDFF05",
  "#05FFB4",
  "#BF3F6A",
  "#FF05CD",
  "#EC9136",
  "#7118F5",
];

const Cell: React.FC<IProps> = ({ value, x, y }) => {
  const board = useSelector((state: RootState) => state.board);
  const { handleChange } = useCustomHooks();

  return (
    <div className={styles.container} style={borders(x, y)}>
      <input
        type="number"
        value={board[x][y]}
        className={styles.cell_input}
        onChange={(e) => handleChange(e, x, y)}
        style={{ background: cellColors[board[x][y]] }}
      />
    </div>
  );
};

export default Cell;
