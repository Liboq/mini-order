import { AdminRole } from '../enums/role.enum';

export class CreateAdminDto {
  email: string;
  password: string;
  code: string;
  role?: AdminRole; // 可选，默认为 ADMIN
}

export class AdminLoginResponse {
  token: string;
  role: AdminRole;
}
