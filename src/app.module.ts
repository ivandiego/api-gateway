import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './users/user.controller';
import { AuthModule } from './auth/auth.module';
import { AdminController } from './admin/admin.controller';
import { SalesController } from './sales/sales.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: process.env.KAFKA_BROKER ? [process.env.KAFKA_BROKER] : ['localhost:9092'],
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: process.env.KAFKA_USERNAME || '',
              password: process.env.KAFKA_PASSWORD || '',
            },
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'user-service',
          },
        },
      },
      {
        name: 'ADMIN_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: process.env.KAFKA_BROKER ? [process.env.KAFKA_BROKER] : ['localhost:9092'],
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: process.env.KAFKA_USERNAME || '',
              password: process.env.KAFKA_PASSWORD || '',
            },
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'admin-service',
          },
        },
      },
      {
        name: 'SALES_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: process.env.KAFKA_BROKER ? [process.env.KAFKA_BROKER] : ['localhost:9092'],
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: process.env.KAFKA_USERNAME || '',
              password: process.env.KAFKA_PASSWORD || '',
            },
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'sales-service',
          },
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: process.env.KAFKA_BROKER ? [process.env.KAFKA_BROKER] : ['localhost:9092'],
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: process.env.KAFKA_USERNAME || '',
              password: process.env.KAFKA_PASSWORD || '',
            },
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'payment-service',
          },
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: process.env.KAFKA_BROKER ? [process.env.KAFKA_BROKER] : ['localhost:9092'],
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: process.env.KAFKA_USERNAME || '',
              password: process.env.KAFKA_PASSWORD || '',
            },
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'notification-service',
          },
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [UserController, AdminController, SalesController],
})
export class AppModule {}
