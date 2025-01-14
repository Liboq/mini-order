export interface IMenuCreateParams {
  storeId: number;
  name: string;
  category: string;
  imageId: number;
  price: number;
  desc: string;
}
export interface IMenuInfo {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  storeId: string;
  type: string;
  image: string | null;
  price: number;
}
export interface IMenuUpdateParams {
  name: string;
  category: string;
  imageId: number;
  price: number;
  desc: string;
}
