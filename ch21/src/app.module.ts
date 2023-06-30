import { Module } from '@nestjs/common';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [ScraperModule]
})
export class AppModule {}
