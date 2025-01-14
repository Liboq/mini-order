import { IMenuInfo } from "../menu";
import { IStoreListResult } from "../store";
import { IUserInfo } from "../user";

export interface IOrderCreateParams {
  storeId: number;
  items: { menuItemId: number; quantity: number }[];
}

export interface IOrderListResult {
  user: IUserInfo;
  id: number;
  store: IStoreListResult;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: {
    id: number;
    quantity: number;
    menuItem: IMenuInfo;
    orderId: number;
  }[];
}
export interface IOrderQueryListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}
export interface IOrderQueryListResponse {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  orders: IOrderListResult[];
}
export interface IOrderDetail extends IOrderListResult {

}