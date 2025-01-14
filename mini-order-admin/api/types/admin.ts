export interface Admin {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  points: number;
  balance: number;
  address: string;
  createdAt: string;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface PaginationResponse<T> {
  total: number;
  items: T[];
  page: number;
  pageSize: number;
}

export interface LoginResponse {
  access_token: string;
  admin: Admin;
}

export interface Store {
  id: number;
  name: string;
  description: string | null;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface Order {
  id: number;
  user: {
    name: string;
    email: string;
  };
  store: {
    name: string;
  };
  items: Array<{
    id: number;
    quantity: number;
    menuItem: {
      name: string;
      price: number;
    };
  }>;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface Log {
  id: number;
  userId: number;
  action: string;
  createdAt: string;
  // ... 其他日志相关字段
}


export interface LogQuery extends PaginationQuery {
  email?: string;
  module?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
} 