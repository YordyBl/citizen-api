import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:true});
  const logger = new Logger('Bootstrap');
  
  app.setGlobalPrefix('api');
  app.enableCors();
  
  app.useGlobalPipes(
      new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      })
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Citizen API')
    .setDescription('API para gestión de incidencias ciudadanas')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación')
    .addTag('incidencia', 'Endpoints de gestión de incidencias')
    .addTag('files', 'Endpoints de gestión de archivos')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`)
  logger.log(`Swagger documentation available at: http://localhost:${process.env.PORT}/api/docs`)
}
bootstrap();
