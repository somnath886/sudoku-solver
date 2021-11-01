import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../store/store.root";
import styles from "./button.module.css";
import { container, TYPES } from "../../services/container";
import ISudokuSolver from "../../services/sudoku-solver/sudoku.solver.interface";
import { updateWholeBoard } from "../../store/board/slice";

const Button: React.FC = () => {
  const board = useSelector((state: RootState) => state.board);
  const dispatch = useDispatch();

  function handleClick() {
    const SudokuSolver = container.get<ISudokuSolver>(TYPES.ISudokuSolver);
    SudokuSolver.setLocalBoard(board);
    SudokuSolver.generateDetails();
    const t0 = performance.now();
    SudokuSolver.solverAlgorithm();
    const t1 = performance.now();
    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
    dispatch(updateWholeBoard({ board: SudokuSolver.getLocalBoard() }));
  }

  return (
    <button
      style={{ color: "white" }}
      onClick={handleClick}
      className={styles.container}
    >
      SOLVE
    </button>
  );
};

export default Button;
