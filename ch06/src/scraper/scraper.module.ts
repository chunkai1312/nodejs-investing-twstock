import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TwseScraperService } from './twse-scraper.service';

@Module({
  imports: [HttpModule],
  providers: [TwseScraperService],
})
export class ScraperModule {}
