## 弹框组件（form-dialog）

目的：主要是为了解决表单弹框可以进行通过配置进行完成，减少代码的重复书写，解耦；
缺点： 1.带有复杂表格的弹框表单建议自己通过插槽自己完成，简单显示也可使用，需要编辑之类，请使用插槽完成； 2.上传文件未完成；3.如果是过分复杂表单弹框的话，亲！这边不建议你使用，建议你还是自己画；

### 使用方法

`<form-dialog :formData='formData' title='标题' :isShow.sync='isShow' :formGroup='formGroup'> </form-dialog>`

`import formDialog from '@/components/form-dialog/index'`

`export default { formData = [] formGroup=[]}`

#### 1、 主配置

| name                  | Description              | Type     | Default | required |
| --------------------- | ------------------------ | -------- | ------- | -------- |
| isShow                | 显示隐藏弹框             | boolean  | false   | true     |
| loading               | loading 显示             | boolean  | false   |          |
| allDisabled           | 是否全部禁用             | boolean  | false   |          |
| title                 | 弹窗 title               | string   |         | true     |
| width                 | 弹窗宽度                 | width    | 800px   |          |
| isFooter              | 底部按钮栏显示           | boolean  | true    |          |
| isClickLeftHideDialog | 是否点击左边按钮隐藏弹框 | boolean  | true    |          |
| leftBtnText           | 左边按钮文字显示         | string   |         |          |
| rightBtnText          | 右边按钮文字显示         | string   |         |          |
| formGroup             | 表单配置参数             | array    | []      | true     |
| formData              | 表单数据                 | array    | []      | true     |
| rightSubmitApi        | 右边按钮                 | Function | []      |          |

#### 2、 formGroup 配置

| name          | Description                                            | Type    | Default | required |
| ------------- | ------------------------------------------------------ | ------- | ------- | -------- |
| targetElement | 饿了么节点名称或者 text、slot                          | string  | string  | true     |
| isHidden      | 是否隐藏                                               | boolean | false   |          |
| label         | label 字段                                             | string  | string  | true     |
| align         | label 字体对齐方式                                     | string  | left    |          |
| value         | v-model 绑定的属性（ formData 里面的 ）                | string  |         |          |
| colSpan       | 参考 el-col 占的份数                                   | number  | 24      |          |
| props         | 组件属性配置，列：placeholder                          | object  |         |          |
| options       | el-select，el-check 等 下拉的值                        | array   |         |          |
| optionAlias   | el-select，el-check 等 key,value                       | object  |         |          |
| style         | 样式                                                   | object  |         |          |
| class         | from class 类型                                        | object  |         |          |
| targetEvent   | 绑定事件                                               | object  |         |          |
| rules         | 提交时校验的正则                                       | array   |         |          |
| notQuery      | rightSubmitApi 有并且 notQuer 为 true 则不会提交本属性 | boolean | false   |          |

```js 通用详情弹窗 formGroup配置参数示例
export default {
  formGroup: [
    {
      targetElement: "el-input",
      label: "input+正则", //字段
      value: "input", //字段名
      // colSpan: 12, //参考el-col
      isHidden: false, // 是否隐藏
      align: "left",
      props: {
        placeholder: "请填写手机号", //提示内容
        disabled: false, //是否禁用
      },
      style: {
        // 样式
      },
      targetEvent: {
        // 绑定事件
      },
      rules: [
        {
          required: true,
          message: "联系方式",
        },
      ], //验证
    },
    {
      targetElement: "el-input",
      label: "输入框", //字段
      value: "textearea", //字段名
      props: {
        type: "textarea",
        placeholder: "请填写输入框", //提示内容
        disabled: false, //是否禁用
        readonly: true,
      },
      rules: [
        {
          required: true,
          message: "输入框",
        },
      ], //验证
    },
    {
      targetElement: "el-select",
      label: "选择框", //字段
      value: "select", //字段名
      props: {
        placeholder: "请选择", //提示内容
        disabled: false, //是否禁用
      },
      options: [
        {
          label: "options1",
          value: "1",
        },
        {
          label: "options2",
          value: "2",
        },
      ],
      optionAlias: {
        value: "value",
        label: "label",
      },
      rules: [
        {
          required: true,
          message: "选择框不能为空！",
        },
      ],
    },
    {
      targetElement: "el-date-picker",
      label: "年月日选择器", //字段
      value: "datePicker", //字段名
      props: {
        placeholder: "请选择", //提示内容
        disabled: false, //是否禁用
      },
      rules: [
        {
          required: true,
          message: "年月日选择器",
        },
      ],
    },
    {
      targetElement: "el-switch",
      label: "开关", //字段
      value: "datePicker", //字段名
      props: {
        placeholder: "请选择", //提示内容
        disabled: false, //是否禁用
      },
      rules: [
        {
          required: true,
          message: "switch",
        },
      ],
    },
    // {
    //   targetElement: 'el-radio-group',
    //   label: '单选框',
    //   value: 'radio', //字段名
    //   props: {
    //     placeholder: '请选择', //提示内容
    //     disabled: false, //是否禁用
    //   },
    //   options: [{
    //     label: '单选框1',
    //     value: '1'
    //   }, {
    //     label: '单选框2',
    //     value: '2'
    //   },],
    //   optionAlias: {
    //     value: 'value',
    //     label: 'label',
    //   },
    //   rules: [{
    //     required: true,
    //     message: '单选框不能为空'
    //   },]
    // },
    {
      targetElement: "el-checkbox-group",
      label: "复选框",
      value: "checkbox", //字段名
      props: {
        placeholder: "请选择", //提示内容
        disabled: false, //是否禁用
      },
      options: [
        {
          label: "复选框1",
          value: "1",
        },
        {
          label: "复选框2",
          value: "2",
        },
        {
          label: "复选框3",
          value: "3",
        },
      ],
      optionAlias: {
        value: "value",
        label: "label",
      },
      rules: [
        {
          required: true,
          message: "复选框不能为空",
        },
      ],
    },
    {
      targetElement: "text",
      label: "文本",
      value: "text",
      notQuery: true, // 是否 api 参数
    },
  ],
  formBtn: [
    {
      label: "取消1",
      targetEvent: {
        click: () => {},
      },
    },
    {
      label: "确定",
      type: "primary",
      targetEvent: {
        click: () => {
          console.log("45a4sd5as4d5asd");
        },
      },
    },
  ],
  rightSubmitApi: "", // submit 提交接口
  formData: {
    input: "1231232",
    textearea: "1123123",
    select: "",
    datePicker: "",
    switch: false,
    radio: "",
    checkbox: [],
    text: "这是一段文本，用于预览",
  },
};
```

详见 form-dialog.vue
