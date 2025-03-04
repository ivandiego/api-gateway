import { IsNumber, IsString, Min, Max } from 'class-validator';

export class PurchaseTicketDto {
  @IsString()
  userId: string;

  @IsString()
  eventId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  quantity: number;
}
