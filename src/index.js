'use strict'

/**
 * dsh-plugin-effort-slider — Host half (client-only surface plugin).
 *
 * 无宿主侧行为：这个空的 apply 仅为了让插件出现在宿主 composition / Loader 中。
 * 浏览器侧通过 exports["./client"] 提供，并由 package.json 的 dsh.client 声明发现。
 */
module.exports = {
  name: 'dsh-plugin-effort-slider',
  apply() {},
}
