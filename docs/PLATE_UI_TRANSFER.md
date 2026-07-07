# 六爻排盘输入与卦盘 UI 迁移说明

本项目的排盘 UI 已拆成可复用层，方便迁移到另一个系统。

## 1. 必须复制的 UI 文件

```text
src/ui/coinOptions.js
src/ui/plateRenderer.js
plate-ui.css
```

其中：

- `coinOptions.js`：铜钱投掷选项与 6/7/8/9 映射。
- `plateRenderer.js`：把 `buildPlateViewModel()` 的返回值渲染成传统排盘样式。
- `plate-ui.css`：传统排盘样式，包含五行颜色、六爻表格、高亮、神煞标签等。

## 2. 必须复制的排盘核心

仍然使用 `liuyao-web` Web 3.2 的核心入口：

```ts
import { buildPlateViewModel } from './engine/plateViewModel'
```

调用：

```ts
const vm = buildPlateViewModel({
  question,
  castTime,
  numbers,
})
```

`numbers` 必须是从初爻到上爻的 6 个值：

```text
6 = 三字 = 老阴 = 阴动变阳
7 = 两字一背 = 少阳 = 阳静
8 = 一字两背 = 少阴 = 阴静
9 = 三背 = 老阳 = 阳动变阴
```

## 3. 输入组件如何复用

```js
import { COIN_THROW_OPTIONS, LINE_LABELS, DEFAULT_NUMBERS } from './ui/coinOptions.js'
```

示例：

```js
const html = LINE_LABELS.map((label, idx) => `
  <div class="yao-input-row">
    <div class="line-label">${label}</div>
    <select data-plate-yao-index="${idx}">
      ${COIN_THROW_OPTIONS.map(opt => `
        <option value="${opt.value}">${opt.text}</option>
      `).join('')}
    </select>
  </div>
`).join('')
```

## 4. 卦盘渲染如何复用

```js
import { renderPlateViewModelHtml } from './ui/plateRenderer.js'

const vm = buildPlateViewModel({ question, castTime, numbers })
container.innerHTML = renderPlateViewModelHtml(vm)
```

紧凑模式：

```js
container.innerHTML = renderPlateViewModelHtml(vm, { compact: true })
```

## 5. 样式依赖

另一个系统的 HTML 里加入：

```html
<link rel="stylesheet" href="plate-ui.css" />
```

如果目标系统已有 CSS，注意不要覆盖这些 class：

```text
liuyao-plate
plate-question-block
plate-strip
plate-main-card
plate-pillars
classical-plate-table
ganzhi
wx-mu / wx-huo / wx-tu / wx-jin / wx-shui
```

## 6. 五行颜色

`plateRenderer.js` 内部按天干地支自动加颜色：

```text
木：wx-mu
火：wx-huo
土：wx-tu
金：wx-jin
水：wx-shui
```

目标系统只要带上 `plate-ui.css`，天干地支就会自动按五行显示颜色。

## 7. 推荐迁移顺序

1. 先复制 `liuyao-web` 的完整排盘核心。
2. 确认 `buildPlateViewModel()` 能在新系统里运行。
3. 复制 `src/ui/coinOptions.js`。
4. 复制 `src/ui/plateRenderer.js`。
5. 复制 `plate-ui.css`。
6. 在新系统中用 `COIN_THROW_OPTIONS` 做输入，用 `renderPlateViewModelHtml(vm)` 做显示。

不要在新系统里重新计算四柱、六神、空亡、神煞、长生。全部读取 `PlateViewModel`。
