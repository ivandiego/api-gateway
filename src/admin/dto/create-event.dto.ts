import { IsString, IsInt, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {

  @ApiProperty({
    description: 'ID do usuário que está criando o evento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Nome do evento',
    example: 'Show do Coldplay',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Quantidade total de ingressos disponíveis para o evento',
    example: 100,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  availableTickets: number;
}
