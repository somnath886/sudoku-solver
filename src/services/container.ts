import { Container } from "inversify";

import ISudokuSolver from "./sudoku-solver/sudoku.solver.interface";
import SudokuSolver from "./sudoku-solver/sudoku.solver.service";

const TYPES = {
  ISudokuSolver: Symbol.for("ISudokuSolver"),
};

const container = new Container();
container.bind<ISudokuSolver>(TYPES.ISudokuSolver).to(SudokuSolver);

export { container, TYPES };
