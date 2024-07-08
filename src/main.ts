import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/webhooks', bodyParser.raw({ type: 'application/json' }));

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // for local testing
    // origin: 'PROD URL'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
