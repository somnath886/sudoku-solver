import React from "react";
import { useDispatch } from "react-redux";

import { updateOneCellRedux } from "../../store/board/slice";

export default function useCustomHooks() {
  const dispatch = useDispatch();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    x: number,
    y: number
  ) {
    const local = e.target.valueAsNumber;
    const condition = local >= 1 && local <= 9;
    if (condition) {
      dispatch(
        updateOneCellRedux({
          x: x,
          y: y,
          valueToUpdateWith: local,
        })
      );
    }
  }

  return { handleChange };
}
