// import { Controller, Get, Post, Body, Inject,UseGuards } from '@nestjs/common';
// import { ClientKafka } from '@nestjs/microservices';
// import { firstValueFrom } from 'rxjs';
// import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
// import { CreateTicketDto } from './dto/create-ticket.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { Role } from '../auth/role.enum';
// @ApiTags('Sales')
// @ApiBearerAuth() // Adiciona suporte a JWT no Swagger
// @UseGuards(JwtAuthGuard, RolesGuard) // Protege todos os endpoints deste controller
// @Roles(Role.User) 
// @Controller('sales')
// export class SalesController {
//   constructor(@Inject('SALES_SERVICE') private readonly userService: ClientKafka) {}

//   async onModuleInit() {
//     this.userService.subscribeToResponseOf('get_available_events');
//     this.userService.subscribeToResponseOf('buy_ticket_all');
//     await this.userService.connect();
//   }

//   // ✅ Listar eventos disponíveis
//   @Get('events')
//   @ApiOperation({ summary: 'List available events' })
//   @ApiResponse({ status: 200, description: 'List of available events' })
//   async getAvailableEvents() {
//     console.log("ivanivan11")
//     return await firstValueFrom(this.userService.send('get_available_events', {}));
//   }

//   // // ✅ Comprar bilhete
//   // @Post('buy-ticket')
//   // @ApiBody({
//   //   description: 'Details required to buy a ticket',
//   //   type: CreateTicketDto,
//   // })
//   // @ApiOperation({ summary: 'Buy a ticket for an event' })
//   // @ApiResponse({ status: 201, description: 'Ticket successfully purchased' })
//   // @ApiResponse({ status: 400, description: 'Validation failed or not enough tickets available' })  
//   // async buyTicket(@Body() createTicketDto: CreateTicketDto) {
//   //   await firstValueFrom(this.userService.send('buy_ticket_all', createTicketDto));
//   //   return {};
//   //   //return await firstValueFrom(this.userService.send('buy_ticket', createTicketDto));
//   // }
// }

import { Controller, Get, Post, Body, Inject, UseGuards, BadRequestException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTicketDto } from './dto/create-ticket.dto';

// import { RegisterDto } from './dto/register.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { Roles } from '../auth/roles.decorator';
// import { Role } from '../auth/role.enum';
// import { RolesGuard } from '../auth/roles.guard';
// import { User } from '../users/model/user.model';





@ApiTags('Sales')
@Controller('sales')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.User)
  export class SalesController {
    constructor(@Inject('ADMIN_SERVICE') private readonly userService: ClientKafka) {}
  async onModuleInit() {
    this.userService.subscribeToResponseOf('get_available_events');
    this.userService.subscribeToResponseOf('buy_ticket');
    await this.userService.connect();
  }

    @Get('events')
    @ApiOperation({ summary: 'List available events' })
    @ApiResponse({ status: 200, description: 'List of available events' })
    async getAvailableEvents() {
      console.log("'events'")
      return await firstValueFrom(this.userService.send('get_available_events', {}));
    }

    @Post('buy-ticket')
    @ApiBody({
      description: 'Details required to buy a ticket',
      type: CreateTicketDto,
    })
    @ApiOperation({ summary: 'Buy a ticket for an event' })
    @ApiResponse({ status: 201, description: 'Ticket successfully purchased' })
    @ApiResponse({ status: 400, description: 'Validation failed or not enough tickets available' })
    async buyTicket(@Body() createTicketDto: CreateTicketDto) {
      const response = await firstValueFrom(this.userService.send('buy_ticket', createTicketDto));

      if (!response.success) {
        throw new BadRequestException(response.message);
      }

      return response.data; // Retorna o ticket criado se não houver erro
    }
}
