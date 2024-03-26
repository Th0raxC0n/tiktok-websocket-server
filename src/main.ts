// Other imports remain untouched
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem'),
  };
  
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  
  await app.listen(3000);
}

bootstrap();
