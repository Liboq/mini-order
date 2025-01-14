import { request } from "@/lib/request";
import { IMembershipsResult, ITopMenuItemsResult, IUserStoreInfo } from "@/shared/interfaces";

export const getStoreList = (params: { name: string }) => request<RequestResult<[]>>({ method: 'GET', url: '/stores/search', params })
export const joinStore = (params: { storeId: number }) => request<RequestResult<[]>>({ method: 'POST', url: `/stores/${params.storeId}/join` })
export const updateStore = (data: { name: string, description: string }) => request<RequestResult<string>>({ method: 'POST', url: `/stores/update`, data })
export const getTopMenuItems = () => request<RequestResult<ITopMenuItemsResult[]>>({ method: 'GET', url: `/stores/top-menu-items` })

export const getMemberships = () => request<RequestResult<IMembershipsResult[]>>({ method: 'GET', url: `/stores/user-memberships` })
export const updateMembership = (data: {
    userId: number;
    accept: boolean;
    storeId: number;
}) => request<RequestResult<string>>({ method: 'POST', url: `/stores/update-membership`, data })
export const getUserStore = () => request<RequestResult<IUserStoreInfo[]>>({ method: 'GET', url: `/stores/user-selected` })
