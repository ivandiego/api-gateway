import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './users/user.controller';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'USER_SERVICE', transport: Transport.KAFKA, options: { client: { brokers: ['kafka:9092'] }, consumer: { groupId: 'user-service' } } },
      { name: 'ADMIN_SERVICE', transport: Transport.KAFKA, options: { client: { brokers: ['kafka:9092'] }, consumer: { groupId: 'admin-service' } } },
      { name: 'SALES_SERVICE', transport: Transport.KAFKA, options: { client: { brokers: ['kafka:9092'] }, consumer: { groupId: 'sales-service' } } },
      { name: 'PAYMENT_SERVICE', transport: Transport.KAFKA, options: { client: { brokers: ['kafka:9092'] }, consumer: { groupId: 'payment-service' } } },
      { name: 'NOTIFICATION_SERVICE', transport: Transport.KAFKA, options: { client: { brokers: ['kafka:9092'] }, consumer: { groupId: 'notification-service' } } },
    ]),
  ],
  controllers: [UserController],
})
export class AppModule {}
