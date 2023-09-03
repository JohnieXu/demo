# 使用指南

::: warning
这是一个 TSDoc + Vuepress 自动生成项目文档的示例项目
:::

## 快速上手

```bash
cd tsdoc-demo
yarn // 或者 npm install
yarn docs:dev // 或者 npm run docs:dev
```

## 目录说明

- `docs/api/` 下面所有的文件都是由 TSDoc 生成的 API 文档

  ::: warning
  1. 请不要手动修改此目录下任何文件
  2. 此目录下的文件是否由 git 管理可自行选择
  :::

  要更新 `docs/api/` 请执行：

  ```bash
  yarn docs:prepare // 或者 npm run docs:prepare
  ```

- `guide` 目录为手动编写
  
  ::: warning
  此目录下文件可自由修改，可参考 [Vuepress](https://vuepress.vuejs.org/zh/) 文档
  :::