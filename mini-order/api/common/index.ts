import { request } from "@/lib/request";
import { ImageInfo } from "@/shared/interfaces";

export const uploadFile = (file: FormData) => request<RequestResult<ImageInfo>>({ url: '/upload', method: 'POST', data: file , headers: { 'Content-Type': 'multipart/form-data' } }) 