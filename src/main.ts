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

  // Verificar se estamos rodando no Confluent Cloud
  const isCloudKafka = process.env.KAFKA_BROKER !== undefined;

  console.log(`🚀 Conectando ao Kafka em: ${kafkaBroker}`);
  if (isCloudKafka) {
    console.log('🌍 Usando Confluent Cloud');
  } else {
    console.log('💻 Rodando localmente no Kafka');
  }

  // Conexão com Kafka
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [kafkaBroker],
        ssl: isCloudKafka, // 🔥 SSL só se estiver na nuvem
        sasl: isCloudKafka
          ? {
              mechanism: 'plain',
              username: kafkaUsername,
              password: kafkaPassword,
            }
          : undefined, // Se for local, não usa autenticação
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

  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('🚀 API Gateway rodando em: http://localhost:3000');
  console.log('📖 Swagger UI disponível em: http://localhost:3000/api/docs');
}
bootstrap();
