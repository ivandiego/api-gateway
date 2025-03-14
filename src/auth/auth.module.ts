import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';

// 🔥 Configuração do Kafka (Railway + Confluent Cloud)
const kafkaBroker = process.env.KAFKA_BROKER || 'localhost:9092';
const kafkaSasl =
  process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD
    ? {
        mechanism: 'plain' as const,
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      }
    : undefined;

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [kafkaBroker],
            ssl: !!kafkaSasl,
            sasl: kafkaSasl,
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'auth-service',
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
