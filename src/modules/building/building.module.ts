import { Module } from '@nestjs/common';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';
import { CompoundModule } from '../compound/compound.module';

@Module({
  imports: [CompoundModule],
  controllers: [BuildingController],
  providers: [BuildingService],
})
export class BuildingModule {}
