import { IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseTicketDto {
  @ApiProperty({
    description: 'ID do usuário que está comprando o bilhete',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID do evento para o qual o bilhete está sendo comprado',
    example: '4c9bde12-5bff-4a63-bafc-72cd2f2f5f89',
  })
  @IsUUID()
  eventId: string;

  @ApiProperty({
    description: 'Quantidade de bilhetes comprados',
    example: 3,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5) // 🔥 Máximo de 5 bilhetes por usuário por evento
  quantity: number;
}
