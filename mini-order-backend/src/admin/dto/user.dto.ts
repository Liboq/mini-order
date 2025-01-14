export class CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export class UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  points?: number;
  balance?: number;
  address?: string;
}
