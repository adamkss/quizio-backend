import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const fs = require('fs');
  const httpsOptions = {
    key: fs.readFileSync('src/secrets/server.key'),
    cert: fs.readFileSync('src/secrets/server.crt'),
  }
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  await app.listen(443);
}
bootstrap();
