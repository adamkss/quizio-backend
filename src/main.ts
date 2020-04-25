import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import aws from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('api');

  //configure aws sdk credentials
  aws.config.update({
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
    region: process.env['AWS_DEFAULT_REGION']
  });

  await app.listen(4000);
}
bootstrap();
