import _ from "lodash";

const boardReducer = {
  updateOneCellRedux: (state: Array<Array<number>>, action) => {
    state[action.payload.x][action.payload.y] =
      action.payload.valueToUpdateWith;
  },
  updateWholeBoard: (state: Array<Array<number>>, action) => {
    _.assign(state, action.payload.board);
  },
};

export default boardReducer;
