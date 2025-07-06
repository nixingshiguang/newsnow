# EdgeOne Pages 部署指南

本文档说明如何将 NewsNow 部署到腾讯云 EdgeOne Pages。

## 问题说明

EdgeOne Pages 和 Cloudflare Pages 在处理 API 路由时存在差异：

1. **文件命名约定**：Cloudflare Pages 支持 `.post.ts` 后缀来指定 HTTP 方法，但 EdgeOne Pages 可能不支持这种约定
2. **运行时环境**：EdgeOne Pages 使用不同的 Edge Runtime，需要特殊配置
3. **数据库支持**：EdgeOne Pages 不支持 Cloudflare D1 数据库

## 解决方案

### 1. 代码修改

我们已经进行了以下修改来解决兼容性问题：

- 将 `server/api/s/entire.post.ts` 重命名为 `server/api/s/entire.ts`
- 在路由处理器中添加了明确的 HTTP 方法检查
- 在 `nitro.config.ts` 中添加了 EdgeOne Pages 的配置

### 2. 构建命令

使用专门的 EdgeOne Pages 构建命令：

```bash
npm run build:edgeone
```

这个命令会：
- 设置 `EDGEONE_PAGES=1` 环境变量
- 运行预处理脚本
- 构建应用程序
- 输出到 `dist/output/public` 目录

### 3. 部署步骤

1. **本地构建**：
   ```bash
   npm run build:edgeone
   ```

2. **上传文件**：
   - 将 `dist/output/public` 目录中的所有文件上传到 EdgeOne Pages

3. **环境变量配置**：
   在 EdgeOne Pages 控制台中设置以下环境变量：
   
   ```env
   EDGEONE_PAGES=1
   NODE_ENV=production
   
   # 如果需要登录功能（可选）
   G_CLIENT_ID=your_github_client_id
   G_CLIENT_SECRET=your_github_client_secret
   JWT_SECRET=your_jwt_secret
   
   # 数据库配置（EdgeOne Pages 不支持 D1）
   INIT_TABLE=false
   ENABLE_CACHE=false
   ```

### 4. 功能限制

由于 EdgeOne Pages 的限制，以下功能将不可用：

- **数据库缓存**：EdgeOne Pages 不支持 Cloudflare D1 数据库
- **用户数据同步**：需要外部数据库支持
- **强制刷新**：依赖于数据库的缓存功能

### 5. 替代方案

如果需要完整功能，建议：

1. **使用外部数据库**：
   - 配置 PostgreSQL、MySQL 等外部数据库
   - 修改 `nitro.config.ts` 中的数据库连接器

2. **使用其他平台**：
   - Cloudflare Pages（推荐）
   - Vercel
   - 自托管 Docker

### 6. 故障排除

如果仍然遇到 405 错误：

1. **检查环境变量**：确保 `EDGEONE_PAGES=1` 已设置
2. **检查构建输出**：确认 API 路由文件存在于构建输出中
3. **检查请求方法**：确认前端发送的是 POST 请求
4. **查看日志**：检查 EdgeOne Pages 的部署日志

### 7. 联系支持

如果问题仍然存在，可能是 EdgeOne Pages 平台的限制。建议：

1. 联系腾讯云 EdgeOne Pages 技术支持
2. 考虑迁移到 Cloudflare Pages
3. 使用 Docker 自托管部署

## 测试

部署完成后，可以通过以下方式测试：

```bash
curl -X POST https://your-edgeone-domain.com/api/s/entire \
  -H "Content-Type: application/json" \
  -d '{"sources":["36kr","ithome"]}'
```

如果返回数据而不是 405 错误，说明部署成功。
