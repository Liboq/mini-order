import { ImageInfo } from "../user";

export interface IMenuCreateParams {
  storeId: number;
  name: string;
  category: string;
  imageId?: number;
  price: number;
  desc: string;
}
export interface IMenuInfo {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  storeId?: number;
  category: string;
  emoji: string;
  image?: ImageInfo;
  price: number;
  desc?: string;
}
export interface IMenuUpdateParams {
  name: string;
  category: string;
  imageId?: number;
  price: number;
  desc: string;
  emoji: string;
}
