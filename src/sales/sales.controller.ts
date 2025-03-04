import { Controller, Get, Post, Body, Inject,UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(@Inject('SALES_SERVICE') private readonly userService: ClientKafka) {}

  async onModuleInit() {
    this.userService.subscribeToResponseOf('get_available_events');
    this.userService.subscribeToResponseOf('buy_ticket');
    await this.userService.connect();
  }

    // ✅ Listar eventos disponíveis
    @UseGuards(JwtAuthGuard)
    @Get('events')
    async getAvailableEvents() {
      return await firstValueFrom(this.userService.send('get_available_events', {}));
    }
  
    // ✅ Comprar bilhete
    @UseGuards(JwtAuthGuard)
    @Post('buy-ticket')
    async buyTicket(@Body() createTicketDto: CreateTicketDto) {
      const tickets = await firstValueFrom(this.userService.send('buy_ticket', createTicketDto));
      return JSON.parse(JSON.stringify(tickets));

    }
}
