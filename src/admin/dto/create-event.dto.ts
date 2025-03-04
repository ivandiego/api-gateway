import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
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