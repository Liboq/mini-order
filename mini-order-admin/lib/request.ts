import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { toast } from 'sonner';

const codeMessage: Record<number, string> = {
  400: '请求错误',
  401: '无访问权限',
  403: '请求错误',
  404: '请求不存在',
  406: '请求的格式不可得',
  410: '请求的资源被永久删除',
  422: '当创建一个对象时，发生一个验证错误',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

export interface ErrorResponse {
  message?: string;
}

const errorHandler = async (error: AxiosError<ErrorResponse>) => {
  const { response, code } = error;
  if (response?.status) {
    const statusText = codeMessage[response.status] || response.statusText;
    const { status, data } = response;
    console.log(status);
    if (data?.message && typeof data?.message === 'string') {
      toast.error(data?.message);
    } else {
      toast.error(statusText);
    }
  } else if (code === 'ERR_NETWORK') {
    toast.error('网络连接失败，请检查网络');
  }

  throw error;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || '/api',
  timeout: 10 * 60 * 1000,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token') ?? '';
  if (config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, errorHandler);

axiosInstance.interceptors.response.use((res: AxiosResponse) => {
  const { status, data } = res;
  if (status === 200) {
    if (data instanceof ArrayBuffer) {
      return {
        contentDisposition: res.headers['content-disposition'],
        data,
      };
    }

    if (data instanceof Blob || typeof data === 'string') return data;
    
    return data;
  }
  return data;
}, errorHandler);

export const request = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosInstance.request<unknown, T>(config);
