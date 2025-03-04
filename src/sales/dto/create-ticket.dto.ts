import { IsString, IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    description: 'ID do evento para o qual o ticket está sendo comprado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  eventId: string;

  @ApiProperty({
    description: 'ID do usuário que está comprando o ticket',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Quantidade de tickets que o usuário deseja comprar',
    example: 3,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5) // 🔥 Regra: um usuário pode comprar no máximo 5 bilhetes por evento
  quantity: number;
}
