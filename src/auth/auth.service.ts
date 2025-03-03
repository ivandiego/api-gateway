import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientKafka,
    private readonly jwtService: JwtService
  ) {}

  async onModuleInit() {
    this.userService.subscribeToResponseOf('validate_user');
    await this.userService.connect();
  }

  async validateUser(username: string, password: string) {
    const user = await firstValueFrom(
      this.userService.send('validate_user', { username, password })
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: any) {
        // Gera o payload do JWT
        const payload = { username: user.username, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET, // 🔒 Chave secreta vinda do .env
            expiresIn: '1h', // Define um tempo de expiração
          }),
        };
  }
  
}
