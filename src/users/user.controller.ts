import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientKafka) {}

  async onModuleInit() {
    this.userService.subscribeToResponseOf('get_all_users');
    await this.userService.connect();
  }

  
  @Get()
  async getAllUsers() {
    return await firstValueFrom(this.userService.send('get_all_users', {}));
  }
}
