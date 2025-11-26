# 安静小区雷达 Mock 服务（Quiet House Mini）

为「安静小区雷达 / QuietMap」小程序提供的 **NestJS Mock 后端**。数据全在内存中，覆盖城市 → 小区 → 楼栋（含噪音详情与影响因素）的接口契约，方便前端和同事直接对接调试。

## 已包含的能力

- 统一的 `{ code, msg, result }` 返回格式。
- 城市、小区、楼栋、楼层噪音、影响因素、模型说明等 Mock 数据集。
- 基础筛选与调试参数：`bbox`、`limit`、`minScore`、`levels`、`mockScene`（空数据 / 报错场景）。
- 类型安全的领域模型定义（噪音分数 → 等级映射、模型元数据、POI 因素等）。
- Swagger UI 文档，便于在浏览器快速查看和试调。

## 快速开始

### 环境要求

- Node.js 18+（推荐 LTS 版本）；
- 已安装 npm（使用自带即可）。

### 启动与测试

```bash
npm install
npm run dev    # ts-node-dev 热重载开发
# 或
npm run start  # ts-node 单次运行
# 测试
npm test
```

默认监听 `http://localhost:3000`。常用接口：

- `GET /cities` — 城市列表
- `GET /cities/:cityId/compounds?bbox=minLat,minLng,maxLat,maxLng&limit=100&mockScene=normal` — 指定城市 + 视野范围内的小区
- `GET /compounds/:id` — 小区详情
- `GET /compounds/:id/buildings?minScore=70&levels=QUIET,NORMAL&limit=5` — 楼栋列表及筛选
- `GET /buildings/:id` — 楼栋聚合详情（含楼层噪音与影响因素）
- `GET /about/model` — 模型说明
- Swagger UI：`http://localhost:3000/docs`

## bbox 与 mock 场景

- `bbox` 需要 GCJ-02 四个逗号分隔的数字：`minLat,minLng,maxLat,maxLng`。
- `mockScene=empty` 返回空列表；`mockScene=error` 主动抛错，便于前端错误分支验证。

## TODO 路线图

1. 扩展数据生成脚本（scripts/）以批量随机更多城市/小区/楼栋。
2. 抽出共享类型包，方便小程序端直接复用类型定义。
3. 控制器增加覆盖率，后续补充 E2E 冒烟测试。
