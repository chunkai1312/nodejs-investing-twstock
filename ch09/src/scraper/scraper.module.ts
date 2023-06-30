import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TwseScraperService } from './twse-scraper.service';
import { TpexScraperService } from './tpex-scraper.service';

@Module({
  imports: [HttpModule],
  providers: [TwseScraperService, TpexScraperService],
})
export class ScraperModule {}
