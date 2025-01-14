import { IMenuInfo } from "../menu";
import { ImageInfo, IUserInfo } from "../user";

export interface IStoreCreateParams {
  name: string;
  description: string;
}
export interface IStoreJoinParams {
  userId: number;
  accept: boolean;
}
export interface IStoreJoinResult {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  storeId: number;
  status: string;
  name: string;
  description: string
}

export interface IStoreListResult {
  id: number;
  user: IUserInfo;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string | null;
  memberships: IStoreJoinResult[];
  userStatus: string;
}

export interface IMemberships {
  id: number;
  userId: number;
  storeId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IMembershipsResult {
  id: number;
  user: IUserInfo;
  store: IStoreListResult;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IUserStoreInfo {
  id: number;
  name: string;
  description: string;
  menuItems: IMenuInfo[],
  memberships: IMembershipsResult[]
}

export interface ITopMenuItemsResult {
  id: number;
  name: string;
  storeId: number;
  salesCount: number;
  image: ImageInfo
  emoji: string
}
