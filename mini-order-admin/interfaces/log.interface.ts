export interface ILogUser {
  email: string;
  name: string;
}

export interface ILogItem {
  id: number;
  userId: number | null;
  adminId: number | null;
  action: string;
  module: string;
  description: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  user: ILogUser | null;
  admin: ILogUser | null;
  area: string;
}

export interface ILogResponse {
  total: number;
  items: ILogItem[];
  page: number;
  pageSize: number;
}
