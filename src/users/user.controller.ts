import { Controller, Get, Post, Body, Inject, UseGuards, BadRequestException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { User } from '../users/model/user.model';

@ApiTags('Users')
@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.User)
export class UserController {
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
    console.log("'Get all users'")
    return await firstValueFrom(this.userService.send('get_all_users', {}));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: RegisterDto }) // Define o corpo da requisição esperado no Swagger
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async createUser(@Body() createUserDto: RegisterDto) {
    const response = await firstValueFrom(this.userService.send('create_user', createUserDto));
  
    if (!response) {
      throw new BadRequestException('User creation failed');
    }
  
    return response; // ✅ Agora retorna o usuário corretamente
  }
}
