import { Controller, Get } from '@nestjs/common';
import { aboutModel } from '../../mocks/about-model';
import { ApiResponse as ApiResponseType } from '../../types';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('about')
@ApiTags('模型说明')
export class AboutController {
  @Get('model')
  @ApiOperation({ summary: 'Mock 噪音模型说明（静态文案）' })
  @ApiOkResponse({ description: '模型说明', schema: { example: { code: 0, msg: 'ok', result: aboutModel } } })
  getModelInfo(): ApiResponseType<typeof aboutModel> {
    return { code: 0, msg: 'ok', result: aboutModel };
  }
}
