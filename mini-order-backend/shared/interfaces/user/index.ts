export interface IRegisterParams {
  password: string;
  email: string;
  code: string;
}
export interface ILoginParams {
  email: string;
  password: string;
}
export interface ImageInfo {
  id: number;
  filePath: string;
  httpUrl: string;
}
export interface IUserInfo {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar: ImageInfo | null;
  points: number;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface ILoginResult {
  token: string;
  user: IUserInfo;
}
export interface IUpdateUserInfoParams {
  name: string;
  avatarId?: number;
  address?: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateUserInfoResult extends IUserInfo {}

export interface IResetPasswordParams {
  code: string;
  email: string;
  newPassword: string;
}
