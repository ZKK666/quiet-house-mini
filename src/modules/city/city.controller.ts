import { Controller, Get } from '@nestjs/common';
import { CityService } from './city.service';
import { ApiResponse as ApiResponseType, City } from '../../types';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('cities')
@ApiTags('城市')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: '获取支持的城市列表' })
  @ApiOkResponse({ description: '城市列表', schema: { example: { code: 0, msg: 'ok', result: [{ id: 1, name: '上海', center: { lat: 31.2304, lng: 121.4737 } }] } } })
  getCities(): ApiResponseType<City[]> {
    return { code: 0, msg: 'ok', result: this.cityService.getAll() };
  }
}
