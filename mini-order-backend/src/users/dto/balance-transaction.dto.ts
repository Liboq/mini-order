export class BalanceTransactionDto {
  id: number;
  amount: number;
  type: TransactionType;
  description?: string;
  createdAt: Date;
}

export enum TransactionType {
  CREDIT,
  DEBIT,
}
