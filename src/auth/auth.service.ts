import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from './model/user.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') 
    private readonly userService: ClientKafka,
    private readonly jwtService: JwtService
  ) {}

  async onModuleInit() {
    this.userService.subscribeToResponseOf('validate_user');
    await this.userService.connect();
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await firstValueFrom(
      this.userService.send('validate_user', { username, password })
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
  

  async login(user: User) {
    const payload = { sub: user.id, username: user.username, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
  
}
