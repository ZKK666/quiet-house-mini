import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BuildingService } from './building.service';
import { ApiResponse as ApiResponseType, Building, BuildingDetailResponse } from '../../types';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('楼栋')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Get('compounds/:id/buildings')
  @ApiOperation({ summary: '获取小区内的楼栋列表（可筛选）' })
  @ApiQuery({ name: 'minScore', required: false, description: '最低噪音分数（0-100，越高越安静）' })
  @ApiQuery({ name: 'levels', required: false, description: '噪音等级，逗号分隔，如 QUIET,NORMAL' })
  @ApiQuery({ name: 'limit', required: false, description: '返回的楼栋数量上限（默认 100）' })
  @ApiOkResponse({ description: '楼栋列表', schema: { example: { code: 0, msg: 'ok', result: [] } } })
  getBuildings(
    @Param('id', ParseIntPipe) compoundId: number,
    @Query('minScore') minScore?: string,
    @Query('levels') levels?: string,
    @Query('limit') limit?: string,
  ): ApiResponseType<Building[]> {
    const parsedLimit = limit ? Number(limit) : undefined;
    const parsedMinScore = minScore ? Number(minScore) : undefined;
    const parsedLevels = levels ? levels.split(',').map((item) => item.trim()).filter(Boolean) : undefined;

    return {
      code: 0,
      msg: 'ok',
      result: this.buildingService.getByCompound(compoundId, parsedMinScore, parsedLevels, parsedLimit),
    };
  }

  @Get('buildings/:id')
  @ApiOperation({ summary: '获取楼栋聚合详情（含楼层噪音、影响因素）' })
  @ApiOkResponse({ description: '楼栋详情', schema: { example: { code: 0, msg: 'ok', result: { building: { id: 1001 } } } } })
  getBuildingDetail(@Param('id', ParseIntPipe) id: number): ApiResponseType<BuildingDetailResponse> {
    return { code: 0, msg: 'ok', result: this.buildingService.getDetailById(id) };
  }
}
