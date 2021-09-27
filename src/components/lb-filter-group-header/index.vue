<template>
  <div class="filter-group" ref="header">
    <div class="filter-item-wrapper">
      <div class="filter-items" v-for="item in groupData" :key="item.value">
        <!-- 非隐藏的情况下 -->
        <template v-if="!item.isHidden">
          <component
            v-if="item.targetElement !== 'slot'"
            :is="item.targetElement"
            v-model.trim="bindModelValue[item.value]"
            v-bind="item.props"
            v-on="elementEvents[item.value]"
          >
            <template v-if="item.targetElement === 'el-select'">
              <el-option
                v-for="optionItem in optionsData[item.value]"
                :key="optionItem[item.optionAlias.key]"
                :label="optionItem[item.optionAlias.label]"
                :value="optionItem[item.optionAlias.value]"
              ></el-option>
            </template>
          </component>
        </template>
        <!-- @slot 动态插槽，请在 filterGroupData 中配置 targetElement: 'slot', slotName: 自定义插槽的名字-->
        <slot v-if="item.targetElement === 'slot'" :name="item.slotName"></slot>
      </div>
      <!-- @slot 操作区域的插槽 -->
      <slot name="operate">
        <!-- @slot 操作区域的左边的插槽 -->
        <slot name="operateLeft"></slot>
        <template v-if="operateVisible">
          <el-button
            class="filter-items"
            type="primary"
            @click.stop="handleSearch"
          >
            查询
          </el-button>
          <el-button class="filter-items" @click.stop="resetData">
            清空
          </el-button>
        </template>
        <!-- @slot 操作区域的右边的插槽 -->
        <slot name="operateRight"></slot>
      </slot>
    </div>
    <div class="right-area-wrapper">
      <!-- @slot 右边操作区域的插槽 -->
      <slot name="rightArea">
        <el-button
          v-if="exportOpeaterVisible"
          class="filter-items"
          @click.stop="exportData"
        >
          导出
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script>
import { validateProps } from './validate'
import clonedeep from 'lodash.clonedeep'

const COMPONENT_NAME = 'LbFilterGroupHeader'
const EVENT_SEARCH = 'search'
const EVENT_RESET = 'reset'
const EVENT_EXPORT = 'export'
const EVENT_TRIGGER = 'trigger'
const CUSTOM_TARGET_ELEMENT_MAP = ['el-autocomplete']
const FORMAT_DATE_MAP = ['el-date-picker', 'el-time-picker']
// 创建自定义的value的key值
const createCustomValueKey = (value) => `${value}--customValue`

/**
 * 头部筛选组件
 *
 * @displayNameLb LbFilterGroupHeader
 * @example ./filterGroupHeader.examples.md
 */
export default {
  name: COMPONENT_NAME,
  model: {
    prop: 'query',
    event: EVENT_TRIGGER
  },
  props: {
    /** 组件的配置项，详细配置见下方的 filterGroupData 描述 */
    filterGroupData: {
      type: Array,
      default () {
        return []
      },
      validator: validateProps
    },
    /** Prop name 为 query，该属性实现了双向绑定，使用时可以直接v-model */
    query: {
      type: Object,
      default () {
        return {}
      }
    },
    /** 是否显示导出按钮 */
    exportOpeaterVisible: {
      type: Boolean,
      default: true
    },
    /** 是否显示操作区域 */
    operateVisible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      bindModelValue: {}, // 动态组件绑定v-model的值
      optionsData: {}, // el-select的el-options的数据
      elementProps: {}, // 动态组件绑定的props
      elementEvents: {}, // 动态组件绑定的事件
      effectiveQuery: {}, // 最终有效的值（真正需要的值)
      groupData: []
    }
  },
  watch: {
    query: {
      handler (newVal) {
        // 初始化默认的参数
        this.effectiveQuery = newVal
        this.updateBindModelValue(newVal)
      },
      immediate: true
    },
    effectiveQuery (newVal) {
      // console.log('effectiveQuery change', newVal)
      /**
       * 触发双向绑定的事件，一般不需要用户监听
       */
      this.$emit(EVENT_TRIGGER, newVal)
    },
    filterGroupData: {
      handler () {
        this.initGroup()
      }
    }
  },
  methods: {
    // 初始化组
    async initGroup () {
      const filterGroupData = clonedeep(this.filterGroupData)
      if (!filterGroupData.length) {
        return
      }
      for (const item of filterGroupData) {
        const { targetElement, props, sourceData } = item

        if (sourceData && targetElement === 'el-select') {
          if (props.remote && props.filterable) {
            // 处理el-select 为远程搜索的情况
            this.setRemoteSelectConfig(item)
          }
          this.setSelectOptions(item)
        } else if (targetElement === 'el-autocomplete') {
          this.setAutoCompleteConfig(item)
        }
        // 处理event
        this.setEvents(item)
      }
      this.groupData = filterGroupData
    },

    // 更新BindModelValue
    updateBindModelValue (query) {
      if (!Object.keys(query).length) {
        this.bindModelValue = {}
        return
      }
      for (const filterItem of this.filterGroupData) {
        const targetElement = filterItem.targetElement
        const modelKey = filterItem.value
        const separateQuery = filterItem.separateQuery
        let value = ''
        if (query[modelKey] !== null && typeof query[modelKey] !== undefined) {
          value = query[modelKey]
        }
        if (separateQuery) {
          if (targetElement !== 'el-autocomplete') {
            const result = this.handleSeparateQuery(
              separateQuery,
              query,
              targetElement
            )
            result && this.$set(this.bindModelValue, modelKey, result)
          } else {
            if (value !== null && typeof value !== undefined && modelKey) {
              this.$set(this.bindModelValue, modelKey, value)
            }
          }
        } else {
          if (value !== null && typeof value !== undefined && modelKey) {
            this.$set(this.bindModelValue, modelKey, value)
          }
        }
      }
    },

    // 根据separateQuery的值，解析出bindModelValue中与之对应的值
    handleSeparateQuery (separateQuery, sourceData, targetElement) {
      const result = []
      for (const [separateQueryKey, separateQueryValue] of Object.entries(
        separateQuery
      )) {
        const queryValue = sourceData[separateQueryKey]
        // 判断是否是要特殊处理的时间组件
        let formatQueryValue = null
        if (FORMAT_DATE_MAP.includes(targetElement)) {
          formatQueryValue = queryValue ? new Date(queryValue) : ''
        }
        if (formatQueryValue) {
          result[separateQueryValue] = formatQueryValue
        }
      }
      return result
    },

    // 设置select的el-option的数据
    async setSelectOptions ({
      sourceData,
      responseTemplate,
      formatDataFunc,
      value
    }) {
      let optionsArr = []
      if (Array.isArray(sourceData)) {
        optionsArr = sourceData
      } else {
        const res = sourceData()
        if (res.then) {
          try {
            const response = await res
            const data = this.handleAsyncData(
              response,
              responseTemplate,
              formatDataFunc
            )
            Array.isArray(data) && (optionsArr = data)
          } catch (err) {
            console.log('err: ', err)
            optionsArr = []
          }
        } else {
          Array.isArray(res) && (optionsArr = res)
        }
      }
      this.$set(this.optionsData, value, optionsArr)
    },

    // 设置select远程情况的配置
    setRemoteSelectConfig ({
      props,
      sourceData,
      responseTemplate,
      formatDataFunc,
      value
    }) {
      props['remote-method'] = (query) => {
        sourceData(query).then((response) => {
          let data = this.handleAsyncData(
            response,
            responseTemplate,
            formatDataFunc
          )
          data = Array.isArray(data) ? data : []
          this.$set(this.optionsData, value, data)
        })
      }
    },

    // 设置autocomplete的配置
    setAutoCompleteConfig ({
      props,
      sourceData,
      responseTemplate,
      formatDataFunc
    }) {
      props['fetch-suggestions'] = async (queryString, cb) => {
        const response = await sourceData(queryString)
        let data = this.handleAsyncData(
          response,
          responseTemplate,
          formatDataFunc
        )
        // console.log("data", data);
        data = Array.isArray(data) ? data : []
        cb(data)
      }
    },

    // 设置事件
    setEvents (item) {
      const {
        targetElement,
        targetElementEvents,
        value,
        sourceData,
        props
      } = item
      const events = {}
      const { change, select, focus, clear, ...othersEvents } =
        targetElementEvents || {}
      if (targetElement === 'el-autocomplete') {
        events['select'] = (data) => {
          try {
            select && select(data)
          } catch (err) {
            console.err('error message：', err)
          }
          this.handleAutocompleteSelect(data, item)
        }
      } else {
        events['change'] = (data) => {
          try {
            change && change(data)
          } catch (err) {
            console.err('error message：', err)
          }
          this.handleQuery(item)
        }
        // 解决 el-select 远程搜索清除数据后，显示全部的列表数据
        if (sourceData && targetElement === 'el-select') {
          if (props.remote && props.filterable) {
            events['clear'] = () => {
              try {
                clear && clear()
              } catch (err) {
                console.err('error message：', err)
              }
              // 将远程的列表清空
              this.optionsData[value] = []
            }
            events['focus'] = (data) => {
              try {
                focus && focus(data)
              } catch (err) {
                console.err('error message：', err)
              }
              // 重新请求数据
              if (!this.bindModelValue[value]) {
                if (this.optionsData[value] && !this.optionsData[value].length) {
                  this.setSelectOptions(item)
                }
              }
            }
          }
        }
      }
      this.$set(this.elementEvents, value, {
        ...events,
        ...othersEvents
      })
    },

    // 处理异步数据
    handleAsyncData (result, responseTemplate, formatDataFunc) {
      let data = null
      if (!responseTemplate) {
        data = result
      } else {
        data = responseTemplate.split('.').reduce((resultData, currentData) => {
          return resultData[currentData]
        }, result)
        if (formatDataFunc) {
          data = formatDataFunc(data)
        }
      }
      return data
    },

    // 处理el-autocomplete的select方法
    handleAutocompleteSelect (data, item) {
      const { separateQuery, value } = item
      const result = {}
      for (const key in separateQuery) {
        const targetDataKey = separateQuery[key]
        result[targetDataKey] = data[targetDataKey]
      }
      this.bindModelValue[createCustomValueKey(value)] = result
      this.handleQuery(item)
    },

    // 处理query
    handleQuery (item) {
      const { targetElement, separateQuery, value } = item
      const originalEffectiveQuery = Object.assign({}, this.effectiveQuery)
      if (separateQuery) {
        /**
         * 解构的query
         * 应用场景： date-time-picker组件的value在bindModelValue的某个key值下，但是这个key并非与后端约定的key值，此时就可以通过分解query，返回想要的键值对
         * eg: date-time-picker v-model的值是返回一个时间数组。但是这个时间数组不是后端所需的字段，后端假如需要 startTime和endTime的时候
         * 可以通过传入separateQuery: {startTime: 0, endTime: 1}将该组件的bindModelValue解构成{startTime: xxxx, endTime: xxx}
         */
        for (const [paramKey, targetDataKey] of Object.entries(separateQuery)) {
          const targetData = CUSTOM_TARGET_ELEMENT_MAP.includes(targetElement)
            ? this.bindModelValue[createCustomValueKey(value)]
            : this.bindModelValue[value]
          const targetDataValue = targetData ? targetData[targetDataKey] : ''
          originalEffectiveQuery[paramKey] = targetDataValue
        }
      } else {
        originalEffectiveQuery[value] = this.bindModelValue[value]
      }
      this.effectiveQuery = originalEffectiveQuery
    },

    // 处理搜索的回调
    handleSearch () {
      /**
       * 点击搜索按钮的回调
       * @property {object} data 当前组件v-model所绑定的值
       */
      this.$emit(EVENT_SEARCH, this.effectiveQuery)
    },

    // 重置
    resetData () {
      /**
       * 点击重置按钮的回调
       *
       */
      this.$emit(EVENT_RESET)
    },

    // 导出
    exportData () {
      /**
       * 点击导出按钮的回调
       * @property {object} data 当前组件v-model所绑定的值
       */
      this.$emit(EVENT_EXPORT, this.effectiveQuery)
    },

    /**
     * 更新数据源
     * @public
     * @param {string} value filterGroupData 所绑定的value值
     * @param {string} propsName 要更改的属性的key值, 嵌套多层的值用.分隔
     * @param {any} changeData 要改变的值
     */
    updateSourceData (value, propsName, changeData) {
      const targetItem = this.groupData.find((item) => item.value === value)
      if (targetItem) {
        const propsNameList = propsName.split('.')
        if (propsNameList.length === 1) {
          if (propsName !== 'sourceData') {
            targetItem[propsName] = changeData
          } else {
            this.optionsData[value] = changeData
          }
        } else {
          const len = propsNameList.length
          const targetPropsName = propsNameList[len - 1]
          const effectPropsName = propsNameList.slice(0, len - 1)
          const propsItem = effectPropsName.reduce(
            (resultData, currentData) => {
              return resultData[currentData]
            },
            targetItem
          )
          if (propsItem) {
            propsItem[targetPropsName] = changeData
          }
        }
      }
    }
  },
  created () {
    this.initGroup()
  }
}
</script>

<style lang="scss" scope>
.filter-group {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .filter-item-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 10px;
    .filter-items {
      display: block;
      margin-right: 10px;
      margin-bottom: 10px;
      margin-left: 0;
      &:empty {
        display: none;
      }
    }
  }
}
</style>
