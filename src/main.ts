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
  const kafkaSSL = process.env.KAFKA_SSL === 'true';

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
        ssl: kafkaSSL,
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
        sessionTimeout: 30000, // 🔥 Aguarda 30 segundos para estabilizar a conexão
        heartbeatInterval: 5000, // 🔥 Envia batimentos cardíacos para manter a conexão ativa
        retry: {
          retries: 5, // 🔥 Tenta conectar 5 vezes antes de falhar
        },
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
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 API Gateway rodando na porta ${port}`);
  console.log(`📖 Swagger UI disponível em: http://localhost:${port}/api/docs`);
}

bootstrap();
