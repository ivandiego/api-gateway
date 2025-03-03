import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class AppController {
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientKafka) {}

  async onModuleInit() {
    this.userService.subscribeToResponseOf('get_all_users');
    this.userService.subscribeToResponseOf('create_user');
    await this.userService.connect();
  }

  
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getAllUsers() {
    return await firstValueFrom(this.userService.send('get_all_users', {}));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async createUser(@Body() createUserDto: { username: string; password: string }) {
    return await firstValueFrom(this.userService.send('create_user', createUserDto));
  }
}
