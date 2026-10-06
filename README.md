# 未竟 · 机器学习札记

PKU Lab 团队维护的研究手记网站。

- 正式网站：<https://pkulab.github.io/>
- 源码与文章：<https://github.com/pkulab/pkulab.github.io>

网站保留纸张式排版、公式、代码复制、图片放大、目录、表格、折叠推导、搜索和 RSS。正式站没有演示文章、预设话题、样张页或前台写作台。话题只从已发布文章中生成。

## 通过 GitHub 发布文章

拥有本仓库写入权限的成员可以直接发布。组织管理员在 GitHub 中添加成员并分配仓库权限。

1. 打开 `content/posts` 目录，点击 **Add file → Upload files** 上传 Markdown；也可以选 **Create new file** 在线写作。
2. 文件名使用英文小写和短横线，例如 `training-notes.md`。按下面的格式填写文件开头的文章信息。
3. 上传到 `main` 分支并点击 **Commit changes**。如通过分支协作，则合并 Pull Request 后发布。
4. 在仓库 **Actions** 查看 `Publish website`。绿色勾号表示发布完成，文章会出现在网站首页。

```yaml
---
title: 文章标题
slug: training-notes
date: "2026-10-06"
summary: 一两句话概括文章内容。
category: 大模型预训练
tags: [训练, 实验]
authors:
  - name: 作者姓名
    url: https://example.com
    bio: 作者简介，可省略。
draft: false
showToc: true
---
```

在第二个 `---` 后面写 Markdown 正文。`title`、`date`、`authors` 和正文必填；`slug` 可省略，默认采用文件名。日期使用 `YYYY-MM-DD`。分类、标签和摘要均可省略。

`templates/article.md` 是可复制的写作模板，不会出现在网站中。将文章标记为 `draft: true` 或 `status: draft`，网站不会展示它。**这是公开仓库，草稿文件在 GitHub 上仍公开可见**，不要存放未公开资料或密钥。

修改、撤下文章：直接修改相应 Markdown 后提交；需要暂时撤下时，将 `draft` 改成 `true`。搜索、话题目录、RSS 和 Markdown 下载会同时更新。发布失败时旧网站会保留，修正 Actions 指出的错误后再次提交即可。

## 图片与下载

图片上传到 `public/media`，正文使用站点绝对路径：

```markdown
![图片说明](/media/your-figure.png)
```

可在 `public/media` 下按文章建立子目录。图片会支持点击放大；图注可以写成 `说明 | 来源：https://...`。每篇正式文章页都有原始 Markdown 下载按钮。旧网站的 `/api/media/...` 图片链接不适用于新站，请将文件一起上传。

## 排版选项

在 YAML 中可添加以下字段。它们只影响当前文章：

- `editor`：编辑署名，可省略。
- `showToc: false`：关闭目录。
- `numberFigures: true`：为图片编号。
- `formulaOverflow: scroll` 或 `multiline`：长公式的显示方式。
- `tableStyle: rules`、`grid` 或 `zebra`：表格样式。
- `tableWidth: scroll` 或 `wide`：表格宽度。
- `thumbnail: /media/your-image.png`：首页可选缩略图。
- `related: [other-article-slug]`：最多三篇相关文章。
- `revisions: [{date: "2026-10-06", note: "修改说明"}]`：重大修改记录。

正文支持 GitHub 风格表格、脚注和 KaTeX 公式。`> [!NOTE]`、`[!TIP]`、`[!IMPORTANT]`、`[!WARNING]`、`[!CAUTION]` 可用于提示块。代码围栏可写 `python linenos {2-4}` 以显示行号和重点行；`details closed 推导过程` 围栏用于可展开内容，内部有代码围栏时外层使用四个反引号。

## 本地预览与部署

需要 Node.js 22.13 或更高版本。

```sh
npm ci
npm run dev
```

正式导出和验证：

```sh
npm run check
npm run build
npm run preview
```

静态输出位于 `out/`，预览地址为 <http://127.0.0.1:5184>。构建会读取 `content/posts/*.md`，生成文章页面、搜索数据、RSS、站点地图和 Markdown 下载；不需要外部数据库、API 密钥或服务端账号。

GitHub 仓库 **Settings → Pages → Source** 设为 **GitHub Actions**。工作流只在 `main` 发布，Pull Request 仅检查构建。可在 Actions 手动运行 `Publish website`。

主要文件：`app/theme.css` 管理配色和字号，`app/ui/masthead.tsx` 管理首页介绍，`lib/site-config.ts` 管理站点信息，`app/ui/markdown.tsx` 管理正文排版。

## 内容权利

文章版权归各自作者。转载或使用内容请与相应作者确认授权。项目没有替作者指定统一的内容许可。
