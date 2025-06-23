# Artillery 负载测试项目

这是一个使用 [Artillery](https://artillery.io/) 进行API负载测试的项目，用于测试 JSONPlaceholder API 的性能表现。

## 项目概述

本项目配置了对 `https://jsonplaceholder.typicode.com/posts/1` 端点的负载测试，包括：
- 自动化性能测试
- 测试结果报告生成
- HTML可视化报告

## 安装要求

确保你的系统已安装：
- [Node.js](https://nodejs.org/) (推荐 v14 或更高版本)
- [Artillery](https://artillery.io/) 负载测试工具

### 安装 Artillery

```bash
npm install -g artillery
```

## 项目结构

```
artillery-test/
├── artillery.yml          # Artillery 测试配置文件
├── scripts/
│   ├── generate-report.js # 报告生成脚本
│   └── report.html       # HTML 报告文件
├── .gitignore            # Git 忽略文件配置
├── results.json          # 测试结果文件 (自动生成)
├── summary.txt           # 测试摘要文件 (自动生成)
└── README.md             # 项目说明文档
```

## 测试配置

### Artillery 配置 (`artillery.yml`)

- **目标URL**: `https://jsonplaceholder.typicode.com`
- **测试时长**: 10秒
- **并发率**: 每秒5个请求
- **测试场景**: GET `/posts/1` 并验证状态码为200

## 使用方法

### 1. 运行负载测试

```bash
artillery run artillery.yml -o results.json
```

这将：
- 执行负载测试
- 将详细结果保存到 `results.json`
- 在控制台显示实时测试进度和摘要

### 2. 生成测试报告

```bash
node scripts/generate-report.js
```

这将：
- 读取 `results.json` 中的测试数据
- 生成控制台摘要报告
- 创建文本格式的 `summary.txt`
- 更新 HTML 可视化报告 `scripts/report.html`

### 3. 查看HTML报告

在浏览器中打开 `scripts/report.html` 文件，可以查看：
- 测试持续时间
- 总请求数
- 每秒请求数 (RPS)
- 平均延迟
- 延迟分布图表 (p50, p75, p90, p95, p99, p999)

## 快速开始

完整的测试流程：

```bash
# 1. 运行负载测试
artillery run artillery.yml -o results.json

# 2. 生成报告
node scripts/generate-report.js

# 3. 在浏览器中打开 scripts/report.html 查看可视化报告
```

## 测试结果说明

### 控制台输出指标

- **Duration**: 测试运行总时长
- **Total Requests**: 发送的总请求数
- **RPS**: 每秒请求数 (Requests Per Second)
- **Average Latency**: 平均响应时间

### 详细指标 (results.json)

- `http.codes.200`: 成功响应数
- `http.request_rate`: 请求速率
- `http.response_time`: 响应时间统计
  - `min/max`: 最小/最大响应时间
  - `mean`: 平均响应时间
  - `p50/p95/p99`: 响应时间百分位数
- `vusers.completed`: 完成的虚拟用户数
- `vusers.failed`: 失败的虚拟用户数

## 自定义配置

### 修改测试参数

编辑 `artillery.yml` 文件：

```yaml
config:
  target: "你的API地址"
  phases:
    - duration: 30        # 测试时长（秒）
      arrivalRate: 10     # 每秒新用户数
```

### 添加更多测试场景

```yaml
scenarios:
  - name: "GET Posts"
    flow:
      - get:
          url: "/posts"
          expect:
            - statusCode: 200
  - name: "POST New Post"
    flow:
      - post:
          url: "/posts"
          json:
            title: "Test Post"
            body: "Test content"
```

## 故障排除

### 常见问题

1. **HTML报告显示 N/A**: 确保运行了 `node scripts/generate-report.js` 来更新报告
2. **Artillery 命令未找到**: 运行 `npm install -g artillery` 安装 Artillery
3. **权限错误**: 确保有读写项目目录的权限

### 调试技巧

- 使用 `artillery run artillery.yml --debug` 获取详细调试信息
- 检查 `results.json` 文件确认测试数据正确生成
- 验证目标API是否可访问

## 贡献

欢迎提交问题和改进建议！

## 许可证

MIT License 