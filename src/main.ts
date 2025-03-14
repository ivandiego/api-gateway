import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Definir configurações de conexão do Kafka
  const kafkaBroker = process.env.KAFKA_BROKER || 'localhost:9092';
  const kafkaUsername = process.env.KAFKA_USERNAME || '';
  const kafkaPassword = process.env.KAFKA_PASSWORD || '';
  const kafkaSSL = process.env.KAFKA_SSL === 'true'; // 🔥 Converte string para booleano

  console.log(`🚀 Conectando ao Kafka em: ${kafkaBroker}`);
  console.log(`🔹 Kafka SSL: ${kafkaSSL ? 'Ativado' : 'Desativado'}`);
  console.log(`🔹 Kafka Username: ${kafkaUsername}`);
  console.log(`🔹 Kafka Group ID: ${process.env.KAFKA_GROUP_ID}`);

  // Conexão com Kafka
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [kafkaBroker],
        ssl: kafkaSSL, // ✅ Agora o SSL será interpretado corretamente
        sasl: kafkaSSL
          ? {
              mechanism: 'plain',
              username: kafkaUsername,
              password: kafkaPassword,
            }
          : undefined,
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID || 'api-gateway-group',
      },
    },
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Ticket System API')
    .setDescription('API documentation for ticket management system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 🔥 Definir a porta automaticamente via Railway
  const port = process.env.PORT || 3000;
  await app.startAllMicroservices();
  await app.listen(port, '0.0.0.0'); // 🔥 Escuta em todas as interfaces

  console.log(`🚀 API Gateway rodando na porta ${port}`);
  console.log(`📖 Swagger UI disponível em: http://localhost:${port}/api/docs`);
}

bootstrap();
