import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('admin')
export class AdminController {
  constructor(@Inject('ADMIN_SERVICE') private readonly salesService: ClientKafka) {}

  async onModuleInit() {
    this.salesService.subscribeToResponseOf('create_event');
    this.salesService.subscribeToResponseOf('get_available_events');
    this.salesService.subscribeToResponseOf('get_event_by_id');
    this.salesService.subscribeToResponseOf('update_event');
    this.salesService.subscribeToResponseOf('delete_event');
    this.salesService.subscribeToResponseOf('create_ticket');
    this.salesService.subscribeToResponseOf('get_tickets');
    this.salesService.subscribeToResponseOf('delete_ticket');
    // this.salesService.subscribeToResponseOf('update_ticket');
    await this.salesService.connect();
  }

  // ✅ Criar um evento
  @Post('events')
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return await firstValueFrom(this.salesService.send('create_event', createEventDto));
  }

  // ✅ Listar eventos disponíveis
  @Get('events')
  async getAvailableEvents() {
    return await firstValueFrom(this.salesService.send('get_available_events', {}));
  }

  // ✅ Buscar evento por ID
  @Get('events/:id')
  async getEventById(@Param('id') id: string) {
    return await firstValueFrom(this.salesService.send('get_event_by_id', id));
  }

  // ✅ Atualizar evento
  @Put('events/:id')
  async updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return await firstValueFrom(this.salesService.send('update_event', { id, updateEventDto }));
  }

  // ✅ Excluir evento
  @Delete('events/:id')
  async deleteEvent(@Param('id') id: string) {
    return await firstValueFrom(this.salesService.send('delete_event', id));
  }

  // ✅ Criar um novo ticket
  @Post('tickets')
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return await firstValueFrom(this.salesService.send('create_ticket', createTicketDto));
  }

  // ✅ Listar todos os tickets
  @Get('tickets')
  async getAllTickets() {
    return await firstValueFrom(this.salesService.send('get_tickets', {}));
  }

  // ✅ Excluir ticket por ID
  @Delete('tickets/:id')
  async deleteTicket(@Param('id') id: string) {
    return await firstValueFrom(this.salesService.send('delete_ticket', id));
  }

  // @Put('tickets/:id')
  // async updateTicket(@Param('id') id: string, @Body() updateTicketDto: CreateTicketDto) {
  //   return await firstValueFrom(this.salesService.send('update_ticket', { id, ...updateTicketDto }));
  // }
}
