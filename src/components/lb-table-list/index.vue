<template>
  <div>
    <el-table
      ref="elTable"
      v-bind="tableProps"
      v-loading="loading"
      v-on="tableEvents"
      :row-class-name="tableRowClassName"
    >
      <!-- @slot 第一列的插槽 -->
      <slot name="startColumn"></slot>
      <template v-for="(item, index) in tableColumn">
        <template v-if="item.columnProps.slot">
          <!-- @slot 动态插槽，请在 options 的 columnProps 中配置 slot 的名字 -->
          <slot :name="item.columnProps.slot"></slot>
        </template>
        <template v-else>
          <el-table-column
            v-if="item.renderItem"
            :key="`${item.columnProps.prop} + ${index}`"
            v-bind="item.columnProps"
          >
            <template slot-scope="scope">
              <kf-dynamic-component
                :render-method="item.renderItem"
                :source-data="scope.row"
              />
            </template>
          </el-table-column>

          <el-table-column
            v-else
            :key="`${item.columnProps.prop} + ${index}`"
            v-bind="item.columnProps"
          >
            <template v-if="item.subColumns">
              <template v-for="(subItem, subIndex) in item.subColumns">
                <el-table-column
                  v-if="subItem.renderItem"
                  :key="`${subItem.columnProps.prop} + ${subIndex}`"
                  v-bind="subItem.columnProps"
                >
                  <template slot-scope="scope">
                    <kf-dynamic-component
                      :render-method="subItem.renderItem"
                      :source-data="scope.row"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  v-else
                  :key="`${subItem.columnProps.prop} + ${subIndex}`"
                  v-bind="subItem.columnProps"
                />
              </template>
            </template>
          </el-table-column>
        </template>
      </template>
      <!-- @slot 最后一列的插槽 -->
      <slot name="endColumn"></slot>
      <!-- @slot 兼容el-table的append插槽 -->
      <template slot="append">
        <slot name="tableAppend"></slot>
      </template>
      <!-- @slot 拓展el-table的empty插槽 -->
      <template slot="empty">
        <!-- <img v-if="tableProps['empty-img']" src="../../assets/no-data.png" /> -->
        <div>{{ tableProps['empty-text'] || '暂无数据' }}</div>
      </template>
    </el-table>
  </div>
</template>

<script>
import './dynamicComponent.js'

const COMPONENT_NAME = 'LbTableList'
const DEFAULT_TABLE_CONFIG = {
  height: '100%',
  stripe: true,
  'header-align': 'left',
  'header-cell-class-name': 'custom-table-header-cell'
}
const DEFAULT_TABLE_COLUMN = {
  align: 'left'
}

/**
 * 列表组件
 *
 * @displayName LbTableList
 * @example ./tableList.examples.md
 */
export default {
  name: COMPONENT_NAME,
  props: {
    /** tableList 相关配置  */
    options: {
      type: Object,
      default () {
        return {}
      }
    },
    /** 数据加载的loading状态  */
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tableProps () {
      const { props = { data: [] } } = this.options
      return {
        ...DEFAULT_TABLE_CONFIG,
        ...props
      }
    },
    tableColumn () {
      const { tableColumn = [] } = this.options
      tableColumn.forEach((item) => {
        const columnProps = item.columnProps || {}
        item.columnProps = {
          ...DEFAULT_TABLE_COLUMN,
          targentEvent: {},
          ...columnProps
        }
      })
      console.log(tableColumn, 'tableColumntableColumntableColumntableColumn');
      return tableColumn
    },
    tableEvents () {
      const { tableEvents } = this.options
      return tableEvents
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      row.elRowIndex = rowIndex

      // 继承传入的row-class-name
      const customClass = this.tableProps['row-class-name']
      if (customClass) {
        if (typeof customClass === 'string') {
          return customClass
        } else {
          return customClass({ row, rowIndex })
        }
      }
    },

    /**
     * 获取el-table，改方法提供给父组件引用el-table组件实例，用于调用el-table的Table Events
     */
    getTableEl () {
      return this.$refs.elTable
    }
  },
  activated () {
    // fix: https://github.com/ElemeFE/element/issues/4976
    this.$refs.elTable.doLayout()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table__header {
  background: #f7f7f7;
}
.el-table {
  ::v-deep th.gutter {
    background-color: #f7f7f7;
  }
  ::v-deep .el-button--text {
    padding: 0;
    color: #1a66b3;
    font-weight: 400;
  }
  ::v-deep .caret-wrapper {
    height: 12px;
    .sort-caret {
      border-width: 4px;
      &.ascending {
        top: -4px;
      }
      &.descending {
        top: 6px;
      }
    }
  }
  ::v-deep .el-table__empty-text {
    line-height: 20px;
  }
}
</style>
