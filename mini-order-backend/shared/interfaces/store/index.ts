export interface IStoreCreateParams {
  name: string;
  description: string;
}
export interface IStoreJoinParams {
  userId: number;
  accept: boolean;
  storeId: number;
}
export interface IStoreJoinResult {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  storeId: number;
  status: string;
}
