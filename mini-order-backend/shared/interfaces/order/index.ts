export interface IOrderCreateParams {
  storeId: number;
  items: { menuItemId: number; quantity: number }[];
}

export interface IOrderListResult {
  userId: number;
  id: number;
  storeId: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  items: {
    id: number;
    quantity: number;
    menuItemId: number;
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
  totalCount: number;
  orders: IOrderListResult[];
}
