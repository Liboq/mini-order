import { IsInt, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
class OrderItemDto {
  @IsInt()
  menuItemId: number;
  @IsInt()
  @IsPositive()
  quantity: number;
}
export class CreateOrderDto {
  @IsInt()
  storeId: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
