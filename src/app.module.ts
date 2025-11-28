import { Module } from '@nestjs/common';
import { CityModule } from './modules/city/city.module';
import { CompoundModule } from './modules/compound/compound.module';
import { BuildingModule } from './modules/building/building.module';
import { AboutModule } from './modules/about/about.module';

@Module({
  imports: [CityModule, CompoundModule, BuildingModule, AboutModule],
})
export class AppModule {}
