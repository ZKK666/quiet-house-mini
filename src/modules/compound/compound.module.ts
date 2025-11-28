import { Module } from '@nestjs/common';
import { CompoundController } from './compound.controller';
import { CompoundService } from './compound.service';
import { CityModule } from '../city/city.module';

@Module({
  imports: [CityModule],
  controllers: [CompoundController],
  providers: [CompoundService],
  exports: [CompoundService],
})
export class CompoundModule {}
