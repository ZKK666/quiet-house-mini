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

## 微信小程序端（Taro3 + React + TS）

仓库新增 `miniapp/` 目录，提供静态页面骨架直连本项目 Mock API，方便在微信开发者工具里快速预览。

### 目录概览
- `miniapp/src/pages/home`：城市选择 + 地图视野加载小区（Marker 颜色随噪音等级变化，可点击查看卡片与跳转）。
- `miniapp/src/pages/compound`：小区地图热力点 + 楼栋列表（支持等级筛选、点击 Marker 弹出卡片）。
- `miniapp/src/pages/building-detail`：楼栋综合分与楼层噪音、影响因素。
- `miniapp/src/pages/about-model`：噪音模型说明静态页。
- `miniapp/src/services`：封装请求与接口调用。
- `miniapp/src/store`：Zustand 状态（城市与筛选偏好）。

### 本地运行（推荐微信开发者工具）
1. 在本仓库根目录启动 Mock 后端：`npm install && npm run start`。
2. 进入 `miniapp`：`cd miniapp && npm install`（首次安装 Taro 依赖可能较慢）。
3. 启动微信端编译：`npm run dev:weapp`，或直接用微信开发者工具打开 `miniapp` 目录（选择 "不校验合法域名" 便可请求本地 3000 端口）。
4. 页面入口：主页（地图 Marker 展示小区）→ 选择小区（楼栋热力标记）→ 查看楼栋 → 查看模型说明。

### 常见提示：Taro 全局配置缺失

在本地首次使用 Taro 时，终端可能出现如下警告（尤其在 macOS 环境）：

```
⚠ 获取 taro 全局配置文件失败，不存在全局配置文件：/Users/<yourname>/.taro-global-config/index.json
```

这是 Taro CLI 尝试读取全局配置的提示，不影响项目编译与运行。处理方式：

- 可直接忽略（默认配置已足够）；
- 如需创建全局配置文件，执行一次 `npx taro config init` 即可在用户目录生成 `.taro-global-config`。生成后警告会消失。
