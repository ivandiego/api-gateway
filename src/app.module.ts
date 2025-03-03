import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './users/user.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'USER_SERVICE', transport: Transport.KAFKA, options: { client: { brokers: ['kafka:9092'] }, consumer: { groupId: 'user-service' } } },
      { name: 'ADMIN_SERVICE', transport: Transport.KAFKA, options: { client: { brokers: ['kafka:9092'] }, consumer: { groupId: 'admin-service' } } },
      { name: 'SALES_SERVICE', transport: Transport.KAFKA, options: { client: { brokers: ['kafka:9092'] }, consumer: { groupId: 'sales-service' } } },
      { name: 'PAYMENT_SERVICE', transport: Transport.KAFKA, options: { client: { brokers: ['kafka:9092'] }, consumer: { groupId: 'payment-service' } } },
      { name: 'NOTIFICATION_SERVICE', transport: Transport.KAFKA, options: { client: { brokers: ['kafka:9092'] }, consumer: { groupId: 'notification-service' } } },
    ]),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
