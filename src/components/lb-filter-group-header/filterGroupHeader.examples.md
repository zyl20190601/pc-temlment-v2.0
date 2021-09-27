## demo

::: demo
```vue
<template>
  <div id="app">
    <h4>联动的例子，请选择合作状态 </h4>
    <h4>合作状态：第一个输入框状态变为禁用且默认赋值为123，多选下拉框数据源变为3条，并隐藏时间范围组件</h4>
    <h4>非合作状态：第一个输入框状态变为可用且默认赋值为空，多选下拉框数据源展示全部数据，并显示时间范围组件</h4>
    <kf-filter-group-header
      ref="filterGroupHeader"
      v-model="query"
      :filter-group-data="filterGroupList"
      @export="handleExport"
      @search="handleSearch"
      @reset="handleReset"
    >
     <template #operateRight>
        <el-button class="el-button filter-items el-button--default">操作区域的右边显示</el-button>
    </template>
      <template #name>
        <span style="margin-right: 10px; color: red">filterItem内容的扩展</span>
      </template>
      <template #operateLeft>
        <el-button class="el-button filter-items el-button--default">在操作区域的左边显示</el-button>
    </template>
    </kf-filter-group-header>
  </div>
</template>

<script>
const multipleSelectData = [
  {
    value: "选项 1",
    label: "黄金糕"
  },
  {
    value: "选项 2",
    label: "双皮奶"
  },
  {
    value: "选项 3",
    label: "蚵仔煎"
  },
  {
    value: "选项 4",
    label: "龙须面"
  },
  {
    value: "选项 5",
    label: "北京烤鸭"
  }
]
const mockCityData = ["Alabama", "Alaska", "Arizona",
"Arkansas", "California", "Colorado",
"Connecticut", "Delaware", "Florida",
"Georgia", "Hawaii", "Idaho", "Illinois",
"Indiana", "Iowa", "Kansas", "Kentucky",
"Louisiana", "Maine", "Maryland",
"Massachusetts", "Michigan", "Minnesota",
"Mississippi", "Missouri", "Montana",
"Nebraska", "Nevada", "New Hampshire",
"New Jersey", "New Mexico", "New York",
"North Carolina", "North Dakota", "Ohio",
"Oklahoma", "Oregon", "Pennsylvania",
"Rhode Island", "South Carolina",
"South Dakota", "Tennessee", "Texas",
"Utah", "Vermont", "Virginia",
"Washington", "West Virginia", "Wisconsin",
"Wyoming"]

const autocompleteMock = [
  { value: "三全鲜食（北新泾店）", address: "长宁区新渔路144号" },
  { value: "Hot honey 首尔炸鸡（仙霞路）", address: "上海市长宁区淞虹路661号" },
  {
    value1: "新旺角茶餐厅",
    address: "上海市普陀区真北路988号创邑金沙谷6号楼113"
  },
  { value: "泷千家(天山西路店)", address: "天山西路438号" },
  {
    value: "胖仙女纸杯蛋糕（上海凌空店）",
    address: "上海市长宁区金钟路968号1幢18号楼一层商铺18-101"
  },
  { value: "贡茶", address: "上海市长宁区金钟路633号" },
  {
    value: "豪大大香鸡排超级奶爸",
    address: "上海市嘉定区曹安公路曹安路1685号"
  },
  { value: "茶芝兰（奶茶，手抓饼）", address: "上海市普陀区同普路1435号" },
  { value: "十二泷町", address: "上海市北翟路1444弄81号B幢-107" },
  { value: "星移浓缩咖啡", address: "上海市嘉定区新郁路817号" },
  { value: "阿姨奶茶/豪大大", address: "嘉定区曹安路1611号" },
  { value: "新麦甜四季甜品炸鸡", address: "嘉定区曹安公路2383弄55号" },
  {
    value: "Monica摩托主题咖啡店",
    address: "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F"
  },
  {
    value: "浮生若茶（凌空soho店）",
    address: "上海长宁区金钟路968号9号楼地下一层"
  },
  { value: "NONO JUICE  鲜榨果汁", address: "上海市长宁区天山西路119号" },
  { value: "CoCo都可北新泾店", address: "上海市长宁区仙霞西路" },
  {
    value: "快乐柠檬（神州智慧店）",
    address: "上海市长宁区天山西路567号1层R117号店铺"
  },
  {
    value: "Merci Paul cafe",
    address: "上海市普陀区光复西路丹巴路28弄6号楼819"
  },
  {
    value: "猫山王（西郊百联店）",
    address: "上海市长宁区仙霞西路88号第一层G05-F01-1-306"
  },
  { value: "枪会山", address: "上海市普陀区棕榈路" },
  { value: "纵食", address: "元丰天山花园(东门) 双流路267号" },
  { value: "钱记", address: "上海市长宁区天山西路" },
  { value: "壹杯加", address: "上海市长宁区通协路" },
  {
    value: "唦哇嘀咖",
    address: "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元"
  },
  { value: "爱茜茜里(西郊百联)", address: "长宁区仙霞西路88号1305室" },
  {
    value: "爱茜茜里(近铁广场)",
    address: "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺"
  },
  {
    value: "鲜果榨汁（金沙江路和美广店）",
    address: "普陀区金沙江路2239号金沙和美广场B1-10-6"
  },
  { value: "开心丽果（缤谷店）", address: "上海市长宁区威宁路天山路341号" },
  { value: "超级鸡车（丰庄路店）", address: "上海市嘉定区丰庄路240号" },
  { value: "妙生活果园（北新泾店）", address: "长宁区新渔路144号" },
  { value: "香宜度麻辣香锅", address: "长宁区淞虹路148号" },
  { value: "凡仔汉堡（老真北路店）", address: "上海市普陀区老真北路160号" },
  { value: "港式小铺", address: "上海市长宁区金钟路968号15楼15-105室" },
  { value: "蜀香源麻辣香锅（剑河路店）", address: "剑河路443-1" },
  { value: "北京饺子馆", address: "长宁区北新泾街道天山西路490-1号" }]


export default {
  data() {
    return {
      message: '父组件的数据',
      filterGroupList: [
        {
          targetElement: "el-input",
          value: "keyword",
          props: {
            placeholder: "楼盘名称/所在城市/主播",
            clearable: true
          }
        },
        {
          // 动态具名插槽
          targetElement: "slot",
          slotName: "name"
        },
        {
          targetElement: "el-date-picker",
          value: "dateRange",
          props: {
            "start-placeholder": "开始时间",
            "end-placeholder": "结束时间",
            "range-separator": "-",
            clearable: true,
            type: "daterange",
            "value-format": "yyyy-MM-dd"
          },
          separateQuery: {
            startDate: 0,
            endDate: 1
          }
        },
        {
          targetElement: "el-select",
          value: "eating",
          props: {
            placeholder: "测试多选",
            clearable: true,
            multiple: true,
            "collapse-tags": true
          },
          sourceData: multipleSelectData,
          optionAlias: {
            label: "label",
            value: "value",
            key: "value"
          }
        },
        {
          targetElement: "el-select",
          targetElementEvents: {
            change: this.handleChange
          },
          value: "status",
          props: {
            placeholder: "合作状态",
            clearable: true
          },
          sourceData: [
            {
              label: "合作",
              value: 0
            },
            {
              label: "非合作",
              value: 1
            }
          ],
          optionAlias: {
            label: "label",
            value: "value",
            key: "value"
          }
        },
        {
          targetElement: "el-select",
          value: "cuid",
          props: {
            placeholder: "城市公司",
            clearable: true,
            filterable: true,
            remote: true,
            "reserve-keyword": true
          },
          sourceData: (query) => {
            // 实际的接口
            // return statisticsApi.queryCityOrgPage({
            // name: query && query.trim()
            // })
            // mock 的数据
            return new Promise((resolve) => {
              if (query) {
                setTimeout(() => {
                  const res = mockCityData.filter((item) => {
                    return (
                      item.toLowerCase().indexOf(query && query.toLowerCase()) > -1
                    )
                  })
                  resolve({
                    data: {
                      result: {
                        items: res
                      }
                    }
                  })
                }, 200);
              } else {
                resolve({
                  data: {
                    result: {
                      items: mockCityData
                    }
                  }
                })
              }
            })
          },
          formatDataFunc: (data) => {
            return data.map((item) => {
              return { value: `value:${item}`, label: `label:${item}` }
            })
          },
          responseTemplate: "data.result.items",
          optionAlias: {
            label: "label",
            value: "value",
            key: "id"
          }
        },
        {
          targetElement: "el-autocomplete",
          value: "autocompleteData",
          props: {
            placeholder: "el-autocomplete远程搜索",
            style: {
              width: "200px"
            }
          },
          sourceData: (queryString) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                const results = queryString
                  ? autocompleteMock.filter((item) => {
                      return (
                        item.value && item.value.indexOf(queryString) === 0
                      );
                    })
                  : autocompleteMock;
                resolve(results);
              }, 200);
            });
          },
          separateQuery: {
            address: "address",
            value2222: "value"
          }
        }
      ],
      query: {
        eating: ['选项 1']
      }
    };
  },
  watch: {
    query(newVal) {
      console.log("最新的query：", newVal);
    }
  },
  methods: {
    // 查询
    handleSearch(data) {
      console.log("查询", data);
    },

    // 重置
    handleReset() {
      this.query = Object.assign({}, this.defaultQuery);
    },

    // 处理导出的回调
    handleExport() {
      console.log("开始导出");
    },

    // fileter focus的回调
    handleFocus() {
      console.log(
        "filter 组件的el-selecter的focus事件访问父组件的数据",
        this.message
      )
    },

    handleChange(data) {
      console.log("filter 组件的el-selecter的change事件", data)
      // 模拟数据联动
      // 如果你不想一个一个调用 updateSourceData， 你可以将变化的数据写成一个数组，然后在循环中触发 updateSourceData 方法，简化代码
      if (!data) {
        this.query['keyword'] = 123
        this.$refs.filterGroupHeader.updateSourceData('keyword', 'props.disabled', true)
        this.$refs.filterGroupHeader.updateSourceData('eating', 'sourceData', multipleSelectData.slice(0,3))
        this.$refs.filterGroupHeader.updateSourceData('dateRange', 'isHidden', true)
      } else {
        this.query['keyword'] = ''
        this.$refs.filterGroupHeader.updateSourceData('keyword', 'props.disabled', false)
        this.$refs.filterGroupHeader.updateSourceData('eating', 'sourceData', multipleSelectData)
        this.$refs.filterGroupHeader.updateSourceData('dateRange', 'isHidden', false)
      }
    },
  },
};
</script>
```
:::

::: tip
当你在配置 el-select 的 sourceData 时，你可能想要在父组件获取好数据后将获取的数据直接赋值给
sourceData， 这对于同一模块公用同一数据，避免多次请求很有必要。这个时候你可以使用 this.$refs.filterHeader.updateSourceData(xxxx, 'sourceData', xxx) 方法更新。

如果你是异步引入该组件的，如：
KfFilterGroupHeader: () =>
      import('kfang-saas-common').then((mod) => {
        return mod.KfFilterGroupHeader
      })
这样的写法，可能会使你在 mounted 中 使用 $nextTick() 访问不到 this.$refs.filterHeader

解决方案：
采用同步的引入方式
import { KfFilterGroupHeader } from 'kfang-saas-common'
注意： 如果是ts 请在global.d.ts 中声明 declare module 'kfang-saas-common'
:::
