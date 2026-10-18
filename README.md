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
