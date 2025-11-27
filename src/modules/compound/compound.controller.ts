import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CompoundService } from './compound.service';
import { ApiResponse as ApiResponseType, Compound } from '../../types';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('小区')
export class CompoundController {
  constructor(private readonly compoundService: CompoundService) {}

  @Get('cities/:cityId/compounds')
  @ApiOperation({ summary: '获取城市内（可选视野范围）的 mock 小区列表' })
  @ApiQuery({ name: 'bbox', required: false, description: '地图视野 bbox：minLat,minLng,maxLat,maxLng' })
  @ApiQuery({ name: 'limit', required: false, description: '返回的小区最大数量（默认 100）' })
  @ApiQuery({ name: 'mockScene', required: false, description: '调试专用：设置为 "empty" 或 "error"' })
  @ApiOkResponse({ description: '小区列表', schema: { example: { code: 0, msg: 'ok', result: [] } } })
  getCompounds(
    @Param('cityId', ParseIntPipe) cityId: number,
    @Query('bbox') bbox?: string,
    @Query('limit') limit?: string,
    @Query('mockScene') mockScene?: string,
  ): ApiResponseType<Compound[]> {
    if (mockScene === 'empty') {
      return { code: 0, msg: 'ok', result: [] };
    }
    if (mockScene === 'error') {
      throw new Error('Mock error scene triggered');
    }

    const parsedLimit = limit ? Number(limit) : undefined;
    const parsedBbox = bbox
      ? bbox
          .split(',')
          .map((value) => Number(value.trim()))
          .filter((value) => !Number.isNaN(value))
      : undefined;

    return {
      code: 0,
      msg: 'ok',
      result: this.compoundService.getByCity(cityId, parsedBbox as number[] | undefined, parsedLimit),
    };
  }

  @Get('compounds/:id')
  @ApiOperation({ summary: '获取单个小区详情' })
  @ApiOkResponse({ description: '小区详情', schema: { example: { code: 0, msg: 'ok', result: { id: 101 } } } })
  getCompound(@Param('id', ParseIntPipe) id: number): ApiResponseType<Compound> {
    const result = this.compoundService.getById(id);
    return { code: 0, msg: 'ok', result };
  }
}
