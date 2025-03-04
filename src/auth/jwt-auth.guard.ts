import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('User extracted in JwtAuthGuard:', user); // ✅ DEBUG para verificar user extraído

    if (err || !user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
