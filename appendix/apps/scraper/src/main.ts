import { NestFactory } from '@nestjs/core';
import { Notifier } from '@app/core/notifier';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule.register({ notifier: process.env.NOTIFIER_SERVICE as Notifier })
  );
  await app.listen(3000);
}
bootstrap();
