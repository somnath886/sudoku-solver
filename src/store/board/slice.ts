import { createSlice } from "@reduxjs/toolkit";

import initialBoardState from "./state";
import boardReducer from "./reducer";

const boardSlice = createSlice({
  name: "board",
  initialState: initialBoardState,
  reducers: boardReducer,
});

export const { updateOneCellRedux, updateWholeBoard } = boardSlice.actions;
export default boardSlice.reducer;
