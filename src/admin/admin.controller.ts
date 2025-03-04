import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { firstValueFrom } from 'rxjs';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('admin')
export class AdminController {
  constructor(@Inject('SALES_SERVICE') private readonly userService: ClientKafka) {}

  async onModuleInit() {
    this.userService.subscribeToResponseOf('get_available_events');
    this.userService.subscribeToResponseOf('create_event');
    this.userService.subscribeToResponseOf('create_ticket');
    await this.userService.connect();
  }

    // ✅ Listar eventos disponíveis
    @Get('events')
    async getAvailableEvents() {
        const events = await firstValueFrom(this.userService.send('get_available_events', {}));
        return {events};

    }

    // ✅ Criar um evento
    @Post('events')
    async createEvent(@Body() createEventDto: CreateEventDto) {
      const event = await firstValueFrom(this.userService.send('create_event', createEventDto));
      return JSON.parse(JSON.stringify(event));

    }

    // ✅ Criar um novo ticket
    @Post('tickets')
    async createTicket(@Body() createTicketDto: CreateTicketDto) {
        const ticket = await firstValueFrom(this.userService.send('create_ticket', createTicketDto));
        return JSON.parse(JSON.stringify(ticket));
      }
}
