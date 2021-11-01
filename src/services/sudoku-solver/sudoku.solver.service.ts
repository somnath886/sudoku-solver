import { injectable } from "inversify";
import "reflect-metadata";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

import ISudokuSolver from "./sudoku.solver.interface";
import ICellDetails from "./types";

@injectable()
export default class SudokuSolver implements ISudokuSolver {
  private localBoard = new Array<Array<number>>();
  private backupBoard = new Array<Array<number>>();

  private rowList: Array<Array<number>> = [];
  private columnList: Array<Array<number>> = [];
  private gridList: Array<Array<number>> = [];

  private cellDetailsList: Array<ICellDetails> = [];

  private rowListDetails: Array<Array<ICellDetails>> = [];
  private columnListDetails: Array<Array<ICellDetails>> = [];
  private gridListDetails: Array<Array<ICellDetails>> = [];

  private cellListBackTrackArray: Array<Array<number>> = [];

  private wholeSet = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  setLocalBoard(board: Array<Array<number>>) {
    for (let i = 0; i < board.length; i++) {
      this.localBoard.push(new Array<number>());
      for (let j = 0; j < board[i].length; j++) {
        this.localBoard[i].push(board[i][j]);
      }
    }
    this.makeBackup();
  }

  getLocalBoard() {
    return this.localBoard;
  }

  generateDetails() {
    const lengthOfBoardIndexZero = this.localBoard[0].length;
    this.fillRowColumnGrid(lengthOfBoardIndexZero);
    this.initializeRowColumnGridLists(lengthOfBoardIndexZero);
    this.generateAllCellsDetails();
    this.initializeRowColumnGridDetailsList();
  }

  solverAlgorithm() {
    const t0 = performance.now();
    const checkZero = this.cellDetailsList.filter(
      (cell) => cell.possibilities.length === 0
    ).length;
    const t1 = performance.now();
    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
    const atStart = this.getCellDetailsListLengthWithPossibilitiesOne();
    this.firstStep();
    this.secondStep();
    this.thirdStep();
    const atEnd = this.getCellDetailsListLengthWithPossibilitiesOne();

    if (atEnd > atStart) {
      return this.solverAlgorithm();
    } else if (checkZero > 0) {
      return false;
    } else if (atEnd === atStart && atEnd !== 81) {
      // const least = this.getLeastPossibilityArray();
      // if (least.length > 0) {
      //   const first = least[0];
      //   if (
      //     this.cellListBackTrackArray.length > 1 &&
      //     first.x === this.cellListBackTrackArray[0][0] &&
      //     first.y === this.cellListBackTrackArray[0][1]
      //   ) {
      //     const backtrackLast = this.cellListBackTrackArray[0];
      //     const findBackTrackLast = this.cellDetailsList.find(
      //       (cell) => cell.x === backtrackLast[0] && cell.y === backtrackLast[1]
      //     );
      //     const first = findBackTrackLast;
      //     this.multipleValueAssignments(
      //       first,
      //       backtrackLast[3],
      //       first.memberOfRow,
      //       first.memberOfColumn,
      //       first.memberOfGrid
      //     );
      //     first.possibilities = first.possibilities.filter(
      //       (p) => p === backtrackLast[3]
      //     );
      //     this.cellListBackTrackArray.pop();
      //     this.solverAlgorithm();
      //   }
      //   this.multipleValueAssignments(
      //     first,
      //     first.possibilities[0],
      //     first.memberOfRow,
      //     first.memberOfColumn,
      //     first.memberOfGrid
      //   );
      //   const backtrack = [
      //     first.x,
      //     first.y,
      //     first.possibilities[0],
      //     first.possibilities[1],
      //   ];
      //   first.possibilities = first.possibilities.filter(
      //     (p) => p === first.possibilities[0]
      //   );
      //   this.cellListBackTrackArray.push(backtrack);
      //   this.solverAlgorithm();
      // } else {
      //   this.restoreBackup();
      //   const backtrackLast =
      //     this.cellListBackTrackArray[this.cellListBackTrackArray.length - 1];
      //   const findBackTrackLast = this.cellDetailsList.find(
      //     (cell) => cell.x === backtrackLast[0] && cell.y === backtrackLast[1]
      //   );
      //   const first = findBackTrackLast;
      //   this.multipleValueAssignments(
      //     first,
      //     backtrackLast[3],
      //     first.memberOfRow,
      //     first.memberOfColumn,
      //     first.memberOfGrid
      //   );
      //   first.possibilities = first.possibilities.filter(
      //     (p) => p === backtrackLast[3]
      //   );
      //   this.cellListBackTrackArray.pop();
      //   this.solverAlgorithm();
      // }

      const filtered = this.getLeastPossibilityArray()[0];
      if (filtered === undefined) {
        return false;
      }

      const row = this.rowListDetails[filtered.x];
      const arr: Array<Array<number>> = [];
      row.forEach(
        (r) => r.possibilities.length > 1 && arr.push(r.possibilities)
      );
      const flattened = Array.from(new Set(_.flatten(arr)));

      if (
        flattened.length >
        row.filter((cell) => cell.possibilities.length > 1).length
      ) {
        return false;
      }

      for (const p of filtered.possibilities) {
        const backup: Array<Array<number>> = [];
        for (let i = 0; i < this.localBoard.length; i++) {
          backup.push(new Array<number>());
          for (let j = 0; j < this.localBoard[i].length; j++) {
            backup[i].push(this.localBoard[i][j]);
          }
        }
        this.multipleValueAssignments(
          filtered,
          p,
          filtered.memberOfRow,
          filtered.memberOfColumn,
          filtered.memberOfGrid
        );
        const find = this.cellDetailsList.find(
          (cell) => cell.x === filtered.x && cell.y === filtered.y
        );
        find.possibilities = [p];
        const res = this.solverAlgorithm();
        if (res === true) {
          return true;
        } else {
          for (let i = 0; i < this.localBoard.length; i++) {
            for (let j = 0; j < this.localBoard[i].length; j++) {
              this.localBoard[i][j] = backup[i][j];
            }
          }
          this.rowList = [];
          this.columnList = [];
          this.gridList = [];

          this.cellDetailsList = [];

          this.rowListDetails = [];
          this.columnListDetails = [];
          this.gridListDetails = [];
          this.generateDetails();
        }
      }
    } else if (atEnd === atStart && atEnd === 81) {
      return true;
    }
  }

  private getLeastPossibilityArray(): Array<ICellDetails> {
    for (let i = 2; i < 10; i++) {
      if (
        this.cellDetailsList.filter((cell) => cell.possibilities.length === i)
          .length > 0
      ) {
        return this.cellDetailsList.filter(
          (cell) => cell.possibilities.length === i
        );
      } else {
        continue;
      }
    }
    return [];
  }

  private makeBackup() {
    for (let i = 0; i < this.localBoard.length; i++) {
      this.backupBoard.push(new Array<number>());
      for (let j = 0; j < this.localBoard[i].length; j++) {
        this.backupBoard[i].push(this.localBoard[i][j]);
      }
    }
  }

  private restoreBackup() {
    for (let i = 0; i < this.localBoard.length; i++) {
      for (let j = 0; j < this.localBoard[i].length; j++) {
        this.localBoard[i][j] = this.backupBoard[i][j];
      }
    }
    this.rowList = [];
    this.columnList = [];
    this.gridList = [];

    this.cellDetailsList = [];

    this.rowListDetails = [];
    this.columnListDetails = [];
    this.gridListDetails = [];
    this.generateDetails();
  }

  private bruteForce(cell: ICellDetails, index: number) {
    this.multipleValueAssignments(
      cell,
      cell.possibilities[index],
      cell.memberOfRow,
      cell.memberOfColumn,
      cell.memberOfGrid
    );
    cell.possibilities = cell.possibilities.filter(
      (p) => p === cell.possibilities[index]
    );
    this.solverAlgorithm();
    const check = this.cellDetailsList.filter(
      (cell) => cell.possibilities.length === 0
    ).length;
    if (check > 0) {
      return false;
    } else {
      return true;
    }
  }

  private fillRowColumnGrid(length: number) {
    for (let i = 0; i < length; i++) {
      this.rowList.push(new Array<number>());
      this.columnList.push(new Array<number>());
      this.gridList.push(new Array<number>());
      this.rowListDetails.push(new Array<ICellDetails>());
      this.columnListDetails.push(new Array<ICellDetails>());
      this.gridListDetails.push(new Array<ICellDetails>());
    }
  }

  private initializeRowColumnGridLists(length: number) {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        this.rowList[i][j] = this.localBoard[i][j];
        this.columnList[i][j] = this.localBoard[j][i];
        const gridLocation = this.getGridLocation(i, j);
        this.gridList[gridLocation].push(this.localBoard[i][j]);
      }
    }
  }

  private generateAllCellsDetails() {
    for (let i = 0; i < this.localBoard.length; i++) {
      for (let j = 0; j < this.localBoard[i].length; j++) {
        const cellDetails = this.generateSingleCellDetails(
          this.localBoard[i][j],
          i,
          j
        );
        this.cellDetailsList.push(cellDetails);
      }
    }
  }

  private initializeRowColumnGridDetailsList() {
    for (const cellDetails of this.cellDetailsList) {
      this.rowListDetails[cellDetails.memberOfRow].push(cellDetails);
      this.columnListDetails[cellDetails.memberOfColumn].push(cellDetails);
      this.gridListDetails[cellDetails.memberOfGrid].push(cellDetails);
    }
  }

  private generateSingleCellDetails(
    value: number,
    x: number,
    y: number
  ): ICellDetails {
    const memberOfRow = x;
    const memberOfColumn = y;
    const memberOfGrid = this.getGridLocation(x, y);

    const newCellDetails: ICellDetails = {
      hashId: uuidv4(),
      value: value,
      x: x,
      y: y,
      memberOfRow: memberOfRow,
      memberOfColumn: memberOfColumn,
      memberOfGrid: memberOfGrid,
      possibilities: value !== 0 ? [value] : this.wholeSet,
    };

    return newCellDetails;
  }

  private firstStep() {
    const atStart = this.getCellDetailsListLengthWithPossibilitiesOne();
    this.resolveNakedSingles();
    this.resolveHiddenSingles();
    const atEnd = this.getCellDetailsListLengthWithPossibilitiesOne();

    if (atEnd > atStart) {
      this.firstStep();
    }
  }

  private secondStep() {
    for (const grid of this.gridListDetails) {
      let index = 1;
      const filteredGrid = grid.filter((g) => g.possibilities.length > 1);
      for (const filtered of filteredGrid) {
        for (let i = index; i < filteredGrid.length; i++) {
          const nested = filteredGrid[i];
          if (nested.x === filtered.x) {
            const flattenedNestedFilteredCellsUnique =
              this.flattenAndUniqueFilteredNested(filtered, nested);
            const rowBased = this.evaluatePointingPairs(
              flattenedNestedFilteredCellsUnique,
              this.rowListDetails[nested.x],
              filtered,
              nested
            );
            const gridBased = this.evaluatePointingPairs(
              flattenedNestedFilteredCellsUnique,
              this.gridListDetails[nested.memberOfGrid],
              filtered,
              nested
            );
            if (rowBased.length > 0) {
              this.removeOne(
                this.gridListDetails[nested.memberOfGrid],
                rowBased,
                filtered,
                nested
              );
            }
            if (gridBased.length > 0) {
              this.removeOne(
                this.rowListDetails[nested.x],
                gridBased,
                filtered,
                nested
              );
            }
          } else if (nested.y === filtered.y) {
            const flattenedNestedFilteredCellsUnique =
              this.flattenAndUniqueFilteredNested(filtered, nested);
            const columnBased = this.evaluatePointingPairs(
              flattenedNestedFilteredCellsUnique,
              this.columnListDetails[nested.y],
              filtered,
              nested
            );
            const gridBased = this.evaluatePointingPairs(
              flattenedNestedFilteredCellsUnique,
              this.gridListDetails[nested.memberOfGrid],
              filtered,
              nested
            );
            if (columnBased.length > 0) {
              this.removeOne(
                this.gridListDetails[nested.memberOfGrid],
                columnBased,
                filtered,
                nested
              );
            }
            if (gridBased.length > 0) {
              this.removeOne(
                this.columnListDetails[nested.y],
                gridBased,
                filtered,
                nested
              );
            }
          }
        }
        index++;
      }
    }
    this.firstStep();
  }

  private thirdStep() {
    const threesFilter = this.cellDetailsList.filter(
      (cell) => cell.possibilities.length === 3
    );

    for (const three of threesFilter) {
      const gridIndex = three.memberOfGrid;
      const findGridFiltered = this.gridListDetails[gridIndex].filter(
        (cell) =>
          (cell.possibilities.length === 3 ||
            cell.possibilities.length === 2) &&
          cell !== three
      );
      let flattened = [...three.possibilities];
      let listOfPicks = [three];
      for (const threeTwo of findGridFiltered) {
        if (threeTwo.possibilities.length === 2) {
          if (
            _.intersection(threeTwo.possibilities, three.possibilities)
              .length === 2
          ) {
            flattened = [...flattened, ...threeTwo.possibilities];
            listOfPicks = [...listOfPicks, threeTwo];
          }
        } else if (threeTwo.possibilities.length === 3) {
          if (
            _.intersection(threeTwo.possibilities, three.possibilities)
              .length >= 2
          ) {
            flattened = [...flattened, ...threeTwo.possibilities];
            listOfPicks = [...listOfPicks, threeTwo];
          }
        }
      }
      const flattenedUnique = Array.from(new Set(flattened));
      if (flattenedUnique.length === 3 && listOfPicks.length === 3) {
        const filteredFinal = this.gridListDetails[gridIndex].filter(
          (f) => !_.find(listOfPicks, f) && f.possibilities.length > 1
        );

        filteredFinal.forEach(
          (f) =>
            (f.possibilities = f.possibilities.filter(
              (p) => !flattenedUnique.includes(p)
            ))
        );
      }
    }

    this.firstStep();
  }

  private flattenAndUniqueFilteredNested(
    filtered: ICellDetails,
    nested: ICellDetails
  ): Array<number> {
    const flattenFirst = Array.from(
      new Set(_.flatten([filtered.possibilities, nested.possibilities]))
    );
    const unique = flattenFirst.filter(
      (f) =>
        filtered.possibilities.includes(f) && nested.possibilities.includes(f)
    );
    return unique;
  }

  private flattenOthers(
    arr: Array<ICellDetails>,
    filtered: ICellDetails,
    nested: ICellDetails
  ): Array<number> {
    return Array.from(
      new Set(
        _.flatten(
          arr
            .filter(
              (cell) =>
                cell !== filtered &&
                cell !== nested &&
                cell.possibilities.length > 1
            )
            .map((cell) => cell.possibilities)
        )
      )
    );
  }

  private evaluatePointingPairs(
    arr: Array<number>,
    cellList: Array<ICellDetails>,
    filtered: ICellDetails,
    nested: ICellDetails
  ): Array<number> {
    const othersFlattened = this.flattenOthers(cellList, filtered, nested);
    if (
      arr.length === 2 &&
      filtered.possibilities.length === 2 &&
      nested.possibilities.length === 2
    ) {
      return arr;
    } else {
      const afterMatching = arr.filter((a) => !othersFlattened.includes(a));
      return afterMatching;
    }
  }

  private resolveNakedSingles() {
    for (let i = 0; i < this.cellDetailsList.length; i++) {
      const cell = this.cellDetailsList[i];
      if (cell.possibilities.length > 1) {
        cell.possibilities = this.evaluateForPossibilites(
          cell.possibilities,
          cell.memberOfRow,
          cell.memberOfColumn,
          cell.memberOfGrid
        );
        if (cell.possibilities.length === 1) {
          this.multipleValueAssignments(
            cell,
            cell.possibilities[0],
            cell.memberOfRow,
            cell.memberOfColumn,
            cell.memberOfGrid
          );
        }
      } else if (cell.possibilities.length === 1 && cell.value === 0) {
        this.multipleValueAssignments(
          cell,
          cell.possibilities[0],
          cell.memberOfRow,
          cell.memberOfColumn,
          cell.memberOfGrid
        );
      }
    }
  }

  private evaluateForPossibilites(
    possibilities: Array<number>,
    memberOfRow: number,
    memberOfColumn: number,
    memberOfGrid: number
  ): Array<number> {
    const uniqueAcross = Array.from(
      new Set(
        this.rowList[memberOfRow].concat(
          this.columnList[memberOfColumn].concat(this.gridList[memberOfGrid])
        )
      )
    );
    return possibilities.filter((w) => !uniqueAcross.includes(w) && w !== 0);
  }

  private resolveHiddenSingles() {
    for (const cell of this.cellDetailsList) {
      if (cell.possibilities.length > 1) {
        this.resolveOneHiddenSingle(cell);
      }
    }
  }

  private resolveOneHiddenSingle(cell: ICellDetails) {
    const rowPossibilities = this.collectPossibilitiesWithoutCurrentCell(
      cell,
      this.rowListDetails[cell.memberOfRow]
    );
    const columnPossibilities = this.collectPossibilitiesWithoutCurrentCell(
      cell,
      this.columnListDetails[cell.memberOfColumn]
    );
    const gridPossibilities = this.collectPossibilitiesWithoutCurrentCell(
      cell,
      this.gridListDetails[cell.memberOfGrid]
    );
    const rowMatch = this.matchAgainstPossibilities(cell, rowPossibilities);
    const columnMatch = this.matchAgainstPossibilities(
      cell,
      columnPossibilities
    );
    const gridMatch = this.matchAgainstPossibilities(cell, gridPossibilities);
    if (rowMatch !== 0) {
      this.multipleValueAssignments(
        cell,
        rowMatch,
        cell.memberOfRow,
        cell.memberOfColumn,
        cell.memberOfGrid
      );
      cell.possibilities = this.removeOtherPossibilities(
        rowMatch,
        cell.possibilities
      );
    } else if (columnMatch !== 0) {
      this.multipleValueAssignments(
        cell,
        columnMatch,
        cell.memberOfRow,
        cell.memberOfColumn,
        cell.memberOfGrid
      );
      cell.possibilities = this.removeOtherPossibilities(
        columnMatch,
        cell.possibilities
      );
    } else if (gridMatch !== 0) {
      this.multipleValueAssignments(
        cell,
        gridMatch,
        cell.memberOfRow,
        cell.memberOfColumn,
        cell.memberOfGrid
      );
      cell.possibilities = this.removeOtherPossibilities(
        gridMatch,
        cell.possibilities
      );
    }
  }

  private collectPossibilitiesWithoutCurrentCell(
    cell: ICellDetails,
    arr: Array<ICellDetails>
  ) {
    return _.flatten(arr.filter((a) => a !== cell).map((a) => a.possibilities));
  }

  private matchAgainstPossibilities(cell: ICellDetails, arr: Array<number>) {
    const array: Array<number> = [];
    for (const p of cell.possibilities) {
      if (!arr.includes(p)) array.push(p);
    }
    if (array.length === 1) {
      return array[0];
    } else {
      return 0;
    }
  }

  private getGridLocation(x: number, y: number): number {
    return (
      parseInt(Number(y / 3).toString()) +
      parseInt(Number(x / 3).toString()) * 3
    );
  }

  private getCellDetailsListLengthWithPossibilitiesOne() {
    return this.cellDetailsList.filter(
      (cell) => cell.possibilities.length === 1 && cell.value !== 0
    ).length;
  }

  private multipleValueAssignments(
    cell: ICellDetails,
    value: number,
    memberOfRow: number,
    memberOfColumn: number,
    memberOfGrid: number
  ) {
    cell.value = value;
    this.localBoard[memberOfRow][memberOfColumn] = value;
    this.rowList[memberOfRow][memberOfColumn] = value;
    this.columnList[memberOfColumn][memberOfRow] = value;
    this.gridList[memberOfGrid][memberOfColumn] = value;
  }

  private removeOtherPossibilities(
    toKeep: number,
    arr: Array<number>
  ): Array<number> {
    return arr.filter((a) => a === toKeep);
  }

  private removeOne(
    cellList: Array<ICellDetails>,
    toRemove: Array<number>,
    filtered: ICellDetails,
    nested: ICellDetails
  ): void {
    const filteredCellList = cellList.filter(
      (cell) =>
        cell !== filtered && cell !== nested && cell.possibilities.length > 1
    );
    if (toRemove.length === 1) {
      for (const cell of filteredCellList) {
        cell.possibilities = cell.possibilities.filter(
          (p) => p !== toRemove[0]
        );
      }
    } else if (toRemove.length === 2) {
      for (const cell of filteredCellList) {
        cell.possibilities = cell.possibilities.filter(
          (p) => p !== toRemove[0] && p !== toRemove[1]
        );
      }
    }
  }
}
