import { IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
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
    example: 2,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5) // 🔥 Regra: Um usuário pode comprar no máximo 5 bilhetes por evento
  quantity: number;
}
