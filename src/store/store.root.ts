import { configureStore } from "@reduxjs/toolkit";

import boardSliceReducer from "./board/slice";

const store = configureStore({
  reducer: { board: boardSliceReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
