import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'api-gateway-group',
      },
    },
  });

   // Configuração do Swagger
   const config = new DocumentBuilder()
   .setTitle('Ticket System API')
   .setDescription('API documentation for ticket management system')
   .setVersion('1.0')
   .addBearerAuth() // Adiciona suporte para autenticação JWT no Swagger
   .build();
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api/docs', app, document); // Rota para acessar a documentação
 

  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('API Gateway running at http://localhost:3000');
  console.log('Swagger UI available at http://localhost:3000/api/docs');
}
bootstrap();
