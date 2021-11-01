export default interface IPayload {
  x?: number;
  y?: number;
  valueToUpdateWith: number;
  board?: Array<Array<number>>;
}

export default interface IAction {
  type: string;
  payload: IPayload;
}
