import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ENVIRONMENT_KEY } from './env/env.decorator';
import { Environment } from './env/env.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const env = app.get<Environment>(ENVIRONMENT_KEY, { strict: false });

  app.enableCors({
    origin: [env.frontendUrl, env.baseDevUrl],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('FlowSync API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.port);
}
bootstrap();
