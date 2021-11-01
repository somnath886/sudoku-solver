export default interface ICellDetails {
  hashId: string;
  value: number;
  x: number;
  y: number;
  memberOfColumn: number;
  memberOfRow: number;
  memberOfGrid: number;
  possibilities: Array<number>;
}
