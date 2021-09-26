## options的配置
```js
// options 传入的值为
options: (root) => ({ // root 为父组件的实例
  // el-table相关的props
  props: {
    data: tableData,
    // ...
  },
  // el-table相关的event事件
  tableEvents: {
    'cell-dblclick': root.handleCellClick,
  },
  // tableColumn的相关配置
  tableColumn: [{
    // el-table-column相关的props
    columnProps: {
      // ...
    },
    // 自定义table-column的渲染内容
    renderItem: (createElement, sourcedata) => {
      return createElement('div', {
        domProps: {
          innerHTML: sourcedata.player + '999'
        },
        on: {
          // 调用在父组件的方法
          click: root.clickHandler
        }
      })
    }
  }]
})
```

## Issue
- 当tableColumn中的选项包含 columnProps: {type: 'selection'}时，想通过更改tableColumn的数据动态渲染table列时，type=’selection‘这个多选列会一直存在，即使你tableColumn没有包含columnProps: {type: 'selection'}的选项也会渲染出来

[demo](https://codepen.io/gogogosir/pen/XWjgXyy)


解决方案： 可以通过<template slot="startColumn"></template>插槽去代替，不用再tableColumn中去设置
- el-table 的 formatter 属性优化问题

[github-issue](https://github.com/ElemeFE/element/issues/20809)

::: tip
 如果设置了序号这一项，需要设置其 index 属性, 通常这个方法已经写在 pagination-mixin 这个混合中
:::
```js
// constant.js
{
  columnProps: {
    label: '序号',
    type: 'index',
    fixed: 'left',
    width: '50px',
    index: this.customIndex
  }
}
```

```js
// customIndex.js
customIndex(index: number) {
  return (this.currentPage - 1) * this.pageSize + (index + 1)
}

```

