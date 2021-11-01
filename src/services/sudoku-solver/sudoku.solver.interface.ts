export default interface ISudokuSolver {
  setLocalBoard(board: Array<Array<number>>): void;
  getLocalBoard(): Array<Array<number>>;
  generateDetails(): void;
  solverAlgorithm(): void;
}
