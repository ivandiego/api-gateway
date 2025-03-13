import { Controller, Get, Post, Put, Delete, Body, Param, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@ApiTags('Admin') // Swagger tag
@ApiBearerAuth() // JWT Authentication for Swagger
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todos os endpoints deste controller
@Roles(Role.Admin) // Apenas Admin pode acessar
export class AdminController {
  constructor(@Inject('ADMIN_SERVICE') private readonly salesService: ClientKafka) {}

  async onModuleInit() {
    this.salesService.subscribeToResponseOf('create_event');
    this.salesService.subscribeToResponseOf('get_event_by_id');
    this.salesService.subscribeToResponseOf('update_event');
    this.salesService.subscribeToResponseOf('delete_event');
    this.salesService.subscribeToResponseOf('create_ticket');
    this.salesService.subscribeToResponseOf('get_tickets');
    this.salesService.subscribeToResponseOf('delete_ticket');
    // this.salesService.subscribeToResponseOf('update_ticket');
    this.salesService.subscribeToResponseOf('get_all_sales');

    await this.salesService.connect();
  }

@Get('all-sales')
@ApiOperation({ summary: 'List all sales transactions' })
@ApiResponse({ status: 200, description: 'List of all sales' })
async getAllSales() {
  try {
    console.log("🟢 Sending request to fetch all sales...");
    const sales = await firstValueFrom(this.salesService.send('get_all_sales', {}));
    
    console.log("✅ Sales received from Kafka:", JSON.stringify(sales));
    
    return { success: true, data: sales };
  } catch (error) {
    console.error("❌ Error in getAllSales:", error.message);
    return { success: false, message: "Failed to fetch sales", error: error.message };
  }
}




   @Post('events')
   @ApiOperation({ summary: 'Create a new event' })
   @ApiResponse({ status: 201, description: 'Event successfully created' })
   @ApiBody({ description: 'Event data', schema: {
     type: 'object',
     properties: {
       name: { type: 'string', format: 'string', example: 'Show do Coldplay' },
       userId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' }
     }
   }})
   async createEvent(@Body() createEventDto: { 
     userId: string; 
     name: string; 
   }) {
     try {
       console.log("🟢 Create a new event request received:", JSON.stringify(createEventDto));
   
       // 🔹 Definir availableTickets e totalTickets como 0 antes de enviar para Kafka
       const eventData = {
         ...createEventDto,
         availableTickets: 0,
         totalTickets: 0
       };
   
       // 🔥 Enviar os dados para o Kafka
       const event = await firstValueFrom(this.salesService.send('create_event', eventData));
   
       console.log("✅ Event successfully sent to Kafka:", JSON.stringify(event));
   
       return { success: true, data: event };
     } catch (error) {
       console.error("❌ Error in createEvent:", error.message);
       return { success: false, message: error.message };
     }
   }
   


  // ✅ Buscar evento por ID
  @Get('events/:id')
  @ApiOperation({ summary: 'Get event details by ID' })
  @ApiResponse({ status: 200, description: 'Event details' })
  async getEventById(@Param('id') id: string) {
    return await firstValueFrom(this.salesService.send('get_event_by_id', id));
  }

  // ✅ Atualizar evento
  @Put('events/:id')
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiBody({ description: 'Updated event data', type: UpdateEventDto })
  async updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return await firstValueFrom(this.salesService.send('update_event', { id, updateEventDto }));
  }

  // ✅ Excluir evento
  @Delete('events/:id')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  async deleteEvent(@Param('id') id: string) {
    return await firstValueFrom(this.salesService.send('delete_event', id));
  }

  // ✅ Criar um novo ticket
  @Post('tickets')
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket successfully created' })
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return await firstValueFrom(this.salesService.send('create_ticket', createTicketDto));
  }

  // ✅ Listar todos os tickets
  @Get('tickets')
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, description: 'List of all tickets' })
  async getAllTickets() {
    return await firstValueFrom(this.salesService.send('get_tickets', {}));
  }

  // ✅ Excluir ticket por ID
  @Delete('tickets/:id')
  @ApiOperation({ summary: 'Delete a ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket deleted successfully' })
  async deleteTicket(@Param('id') id: string) {
    return await firstValueFrom(this.salesService.send('delete_ticket', id));
  }

  // @Put('tickets/:id')
  // async updateTicket(@Param('id') id: string, @Body() updateTicketDto: CreateTicketDto) {
  //   return await firstValueFrom(this.salesService.send('update_ticket', { id, ...updateTicketDto }));
  // }
}
