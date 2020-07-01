export class OrderLine {
  id?: number;
  amountOrdered: number;
  amountPicked: number;
  price: number;
  pickingConfirmed: boolean;
  customerOrder: object;
  customer: object;
  product: object;
}
