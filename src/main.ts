import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const fs = require('fs');
  const httpsOptions = {
    key: fs.readFileSync('./secrets/aws/server.key'),
    cert: fs.readFileSync('./secrets/aws/server.crt'),
  }
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    cors: true,
  });
  await app.listen(443);
}
bootstrap();
