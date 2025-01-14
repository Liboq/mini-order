import { request } from "@/lib/request";
import {
  IMenuCreateParams,
  IMenuInfo,
  IMenuUpdateParams,
} from "@/shared/interfaces";

export const addMenu = async (data: IMenuCreateParams) =>
  request<RequestResult<void>>({
    url: "/menu",
    method: "POST",
    data,
  });

export const getMenuList = async (storeId: number) =>
  request<RequestResult<IMenuInfo[]>>({
    url: `/menu/store/${storeId}`,
    method: "GET",
  });
export const updateMenu = async (id: number, data: IMenuUpdateParams) =>
  request<RequestResult<void>>({
    url: `/menu/${id}`,
    method: "PUT",
    data,
  });

