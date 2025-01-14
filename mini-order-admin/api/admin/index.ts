import { request } from '@/lib/request';
import type { PaginationQuery, PaginationResponse, User, Store, Order, LogQuery } from '../types/admin';
import { ILogResponse } from '@/interfaces/log.interface';


export const getUsers = (params: PaginationQuery) =>
  request<RequestResult<PaginationResponse<User>>>({
    url: '/admin/users',
    method: 'GET',
    params,
  })

export const createUser = (data: Partial<User>) =>
  request<RequestResult<User>>({
    url: '/admin/users',
    method: 'POST',
    data,
  })

export const updateUser = (id: number, data: Partial<User>) =>
  request<RequestResult<User>>({
    url: `/admin/users/${id}`,
    method: 'PUT',
    data,
  })

export const deleteUser = (id: number) =>
  request<RequestResult<void>>({
    url: `/admin/users/${id}`,
    method: 'DELETE',
  })

export const getStores = (params: PaginationQuery) =>
  request<RequestResult<PaginationResponse<Store>>>({
    url: '/admin/stores',
    method: 'GET',
    params,
  })

export const createStore = (data: Partial<Store>) =>
  request<RequestResult<Store>>({
    url: '/admin/stores',
    method: 'POST',
    data,
  })

export const updateStore = (id: number, data: Partial<Store>) =>
  request<RequestResult<Store>>({
    url: `/admin/stores/${id}`,
    method: 'PUT',
    data,
  })

export const deleteStore = (id: number) =>
  request<RequestResult<void>>({
    url: `/admin/stores/${id}`,
    method: 'DELETE',
  })

export const getOrders = (params: PaginationQuery) =>
  request<RequestResult<PaginationResponse<Order>>>({
    url: '/admin/orders',
    method: 'GET',
    params,
  })

export const updateOrder = (id: number, data: Partial<Order>) =>
  request<RequestResult<Order>>({
    url: `/admin/orders/${id}`,
    method: 'PUT',
    data,
  })

export const deleteOrder = (id: number) =>
  request<RequestResult<void>>({
    url: `/admin/orders/${id}`,
    method: 'DELETE',
  })

export const login = (data: { email: string; password: string; code: string }) =>
  request<RequestResult<{ token: string }>>({
    url: '/admin/login',
    method: 'POST',
    data,
  })

export const sendCode = (data: { email: string }) =>
  request<RequestResult<{ code: string }>>({
    url: '/admin/send-verification-code',
    method: 'POST',
    data,
  })

export const getLogs = (params: LogQuery) =>
  request<RequestResult<ILogResponse>>({
    url: '/admin/logs',
    method: 'GET',
    params,
  })
