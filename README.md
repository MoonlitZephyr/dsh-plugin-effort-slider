# dsh-plugin-effort-slider

仿 Claude Code 的**思考强度滑块** —— 点一下输入框右侧的模型座位，弹出带火焰动画的滑块，直接改本轮 `reasoningEffort`（`off` / `high` / `max`）。

纯客户端 UI 插件，宿主半是空壳。

## 功能

- 注册到 `conversation.input.model` 槽位（`priority: -1`），接管模型座位的点击
- 滑块上的蓝色火焰用 GLSL 着色器实时绘制：多频正弦叠加 + 时间扰动，拖动时火焰强度和节奏一起变
- 明暗主题自适应（跟随 DSH 的 CSS 变量）
- 选定后真实写入会话的 `reasoningEffort`，随下一条消息提交，而不是只改 UI
- 点击外部或再次点击座位收起

## 结构

```
src/index.js      宿主半：空 shell，只为了让插件进入宿主 composition / Loader
client/bundle.js  浏览器半：CSS 注入 + 槽位注册 + 火焰滑块（约 31 KB，手写，无构建步骤）
package.json      dsh.client.platform = web；exports["./client"]
```

## 安装

```powershell
cd "$env:USERPROFILE\.dsh\profiles\web"
pnpm add file:C:\Users\24521\.dsh\profiles\web\plugins\dsh-plugin-effort-slider
```

同目录 `cordis.patch.yml` 追加：

```yaml
- insert:
    - id: effort-slider
      name: 'dsh-plugin-effort-slider'
```

重启 Harness 后，设置面板里看不到它 —— 效果在输入框的模型座位上。

## 开发

没有构建链路，直接改 `client/bundle.js`：

```powershell
node --check client/bundle.js
cd "$env:USERPROFILE\.dsh\profiles\web"; pnpm install --frozen-lockfile
```

然后**刷新页面**即可（纯客户端插件，不需要重启宿主）。

## License

MIT

## 兼容性（dsh 0.2.x / 桌面版）

- 要求 dsh `>=0.2.1-rc.2 <0.3.0`（`engines.dsh`）。旧版 0.1.0-rc.x 会被 profile 的兼容性闸门直接跳过。
- 自带 `cordis.patch.yml`（`dsh.bundle.patch`）：包名进入 `dsh.profile.bundles` 即完成装配，不再手写 insert。
- web profile 与桌面版共用同一套 web 前端（桌面版页面源是 `dsh-app://app`，未知路径由主进程转发到本地 host），所以纯客户端插件两边行为一致。
