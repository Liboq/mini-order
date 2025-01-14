export class CreateStoreDto {
  name: string;
  description?: string;
  userId?: number;
}

export class UpdateStoreDto {
  name?: string;
  description?: string;
  userId?: number;
} 