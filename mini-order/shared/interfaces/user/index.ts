import { IStoreJoinResult } from "../store";


export interface IRegisterParams {
  password: string;
  email: string;
  code: string;
}
export interface ILoginParams {
  email: string;
  password: string;
}
export interface IUserInfo {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar?: ImageInfo;
  points: number;
  address?: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  store: IStoreJoinResult;
}
export interface ILoginResult {
  token: string;
}
export interface ImageInfo {
  id: number;
  filePath: string;
  httpUrl: string;
}
export interface IUpdateUserInfoParams {
  name: string;
  avatarId?: number;
  address?: string;
  storeId?: number;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateUserInfoResult extends IUserInfo { }

export interface IResetPasswordParams {
  code: string;
  email: string;
  newPassword: string;
}
export interface IBalanceParams {
  page?: number;
  limit?: number;
}

export interface IBalanceTransactionDto {
  id: number;
  amount: number;
  type: TransactionType;
  description?: string;
  createdAt: string;
}

export enum TransactionType {
  CREDIT,
  DEBIT,
}

export interface IUserBalance {
  total: number;
  page: number;
  limit: number;  
  data: IBalanceTransactionDto[];
}


