import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Definir configurações de conexão do Kafka
  const kafkaBroker = process.env.KAFKA_BROKER || 'localhost:9092';
  const kafkaUsername = process.env.KAFKA_USERNAME;
  const kafkaPassword = process.env.KAFKA_PASSWORD;
  const useSSL = process.env.KAFKA_SSL === 'true'; // ✅ Conversão correta para booleano

  // Verifica se está usando Confluent Cloud (precisa de autenticação)
  const isCloudKafka = kafkaUsername && kafkaPassword;

  console.log(`🚀 Conectando ao Kafka em: ${kafkaBroker}`);
  console.log(isCloudKafka ? '🌍 Usando Confluent Cloud' : '💻 Rodando localmente no Kafka');

  // Conexão com Kafka
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [kafkaBroker],
        ssl: useSSL, // ✅ Agora é booleano
        sasl: isCloudKafka
          ? {
              mechanism: 'plain',
              username: kafkaUsername,
              password: kafkaPassword,
            }
          : undefined, // 🔥 Se local, não usa autenticação
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID || 'api-gateway-group',
      },
    },
  });

  // Inicia os microserviços primeiro
  await app.startAllMicroservices();
  await app.init(); // 🔥 Garante que tudo está inicializado antes de escutar requisições HTTP

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
  await app.listen(port, '0.0.0.0'); // 🔥 Escuta em todas as interfaces (necessário para Railway)

  console.log(`🚀 API Gateway rodando na porta ${port}`);
  console.log(`📖 Swagger UI disponível em: http://localhost:${port}/api/docs`);
}

bootstrap();
