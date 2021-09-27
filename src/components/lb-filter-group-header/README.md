## filterGroupData 每一项的配置参数
| name | Description | Type  | Default |
| ---- | ----------- | ----  | ------- |
| targetElement | 要传入的组件的元素标签（或者是 slot）| string |  |
| isHidden | 是否要隐藏该元素 | boolean | false |
| slotName | 当 targetElement 为 slot 时，slotName 表示 slot 的名字 | string | |
| targetElementEvents | 绑定目标元素的一些方法 | object | {} |
| value | 组件 v-model 所绑定的 key 值,该值必须唯一 | object | {} |
| props | targetElement 组件的相关 props 配置 （style 也可以通过这个参数传入） | object | {} |
| sourceData | 传入组件的数据源 | object 或 function |  |
| responseTemplate | sourceData 为 Promise 时返回的键值,例如返回值为{data: {result: {items: []}}}, 则传入 data.result.item，既可以获取目标值 item 的数据 | string | |
| formatDataFunc | 格式化数据的回调函数，一般用于接口返回值得回调 | function | |
| optionAlias | 当为 el-select 时，此属性用于配置 el-options 组件的 optionsList 的键值对的别名，和循环传入(v-for)的 key 的值 | object | |
| separateQuery | 解构 query，一般用于解构出后端所需要的字段 | object | {} |



::: tip
 注意如果要在targetElementEvents内部要访问父组件的相关属性和方法，则： filterGroupData 的写法如下:
:::
```js
/**
 * 这里的 root 为父组件的实例，所以现在就可以访问到父组件内部的 handleFunc 方法了
应用场景： 对于个别 targetElement 需要监听其内部方法做特殊的行为
*/
filterGroupData = (root) => [{
  targetElementEvents: {
    EventName: root.handleFunc
  }
}]
```

::: tip
  sourceData 详解，适用范围: el-select 和 el-autocomplete 组件
:::
- 如果 el-select 的数据源是静态的，则 sourceData 为一个数组
- 如果 el-select 的数据源是动态获取的，则 sourceData 为一个 promise 函数
- 如果 el-select 的数据源是动态获取的，且在同一个页面其他地方也有用到，此时使用者又不想再次重复请求同一个接口，则推荐在该页面上
先请求拿到数据，在通过给 filterGroupData 中当前项的 sourceData 重新赋值的方式去设置
```js
// demo
sourceData: (query) => {
  return statisticsApi.queryCityOrgPage({
    name: query && query.trim()
  })
}
```

::: tip
  separateQuery 应用场景
:::
- 格式
```js
separateQuery: {
  [后端同学定义的出的字段]: [源数据的目标数据的 key 值（如果源数据是数组，可用数组下标代替）]
}

```

- 如果你设置一个时间范围选择器的时候，假设你传入的value值为date，那如果你不设置该值，则双向绑定的query就是date，但是
后台接口请求的参数不是传入date，而是startTime和endTime字段，这个时候就需要设置separateQuery了

```js
separateQuery: {
  startTime: 0 // 这里的0表示时间范围选择器所绑定的 value 值为 date（数组）的第一个值
  endTime: 1 // 这里的 1 表示时间范围选择器所绑定的 value 值为 date（数组）的第二个值
}

```
## optionAlias
| name | Description | Type | Default |
| ---- | ----------- | ---- | ------- |
| label | 展示的值 | string |  |
| value | 绑定的值 | string | |
| key | v-for的key所绑定的值，一般建议设置同value一样 | string | |
