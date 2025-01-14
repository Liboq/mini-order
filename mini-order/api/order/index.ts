import { request } from "@/lib/request"
import { IOrderCreateParams, IOrderDetail, IOrderQueryListParams, IOrderQueryListResponse } from "@/shared/interfaces"

export const getOrderList = (data: IOrderQueryListParams) =>
    request<RequestResult<IOrderQueryListResponse>>({ method: 'GET', url: `/orders`, data })

export const getStoreOrderList = (data: IOrderQueryListParams) =>
    request<RequestResult<IOrderQueryListResponse>>({ method: 'GET', url: `/orders/store-orders`, data })

export const getOrderDetail = (orderId: number) =>
    request<RequestResult<IOrderDetail>>({ method: 'GET', url: `/orders/${orderId}` })

export const updateOrderStatus = (orderId: number, status: string) =>
    request<RequestResult<string>>({ method: 'PUT', url: `/orders/${orderId}/status`, data: { status } })

export const createOrder = (data: IOrderCreateParams) =>
    request<RequestResult<string>>({ method: 'POST', url: `/orders/create`, data })


