# 六爻读盘手机工具（GitHub Pages / PWA）

这是一个可直接部署到 GitHub Pages 的手机端 PWA 工具。目标：

- 手机随开随查 15 步六爻读盘流程
- 每一步都有填空题、盘面证据、疑点、自由笔记
- 每条读盘笔记自动编号，例如 `LY-20260707-001`
- 每条笔记可以自己改名
- 最后一页自动汇总 15 步记录，并生成断语草稿
- 本机自动保存
- 可选 GitHub Gist 云同步，把笔记长期保存到 web 上

## 文件说明

- `index.html`：入口页面
- `styles.css`：手机 UI 样式
- `app.js`：流程、知识库、笔记、同步逻辑
- `manifest.webmanifest`：PWA 配置
- `sw.js`：离线缓存
- `icons/`：PWA 图标

## 部署到 GitHub Pages

1. 新建一个 GitHub 仓库，例如 `liuyao-pwa`。
2. 把本文件夹里的所有文件上传到仓库根目录。
3. 在 GitHub 仓库设置里打开 Pages。
4. 选择从主分支部署。
5. 打开 GitHub Pages 生成的网址。
6. 手机上用 Safari/Chrome 打开，选择“添加到主屏幕”。

## 云端保存笔记

GitHub Pages 是静态网页，本身不能写数据库。这个工具用 GitHub Gist 存一个私有 JSON 文件作为云端笔记库。

使用步骤：

1. 在 GitHub 创建一个有 Gist 权限的 Token。
2. 打开工具里的「同步」。
3. 粘贴 Token。
4. 点「创建云端笔记库」。
5. 以后每次换设备或做完笔记，点「同步：合并本机与云端」。

注意：Token 会保存在当前手机浏览器本地。不要在公共电脑上使用。更严格的生产版可以改成 Supabase/Firebase 登录后保存。

## 笔记编号规则

系统自动用当天日期编号：

`LY-YYYYMMDD-001`

例如：

`LY-20260707-001`

同一天第二条为：

`LY-20260707-002`

每条笔记也可以手动改名，例如：

- 找钥匙
- 面试结果
- 求财：客户是否付款
- 疾病：头痛何时缓解

## 本地打开说明

直接双击 `index.html` 可以测试大部分功能，但 PWA 离线缓存和云同步最好在 GitHub Pages 或本地 http 服务下测试。

本地测试可运行：

```bash
python -m http.server 8000
```

然后打开：

```text
http://localhost:8000
```
