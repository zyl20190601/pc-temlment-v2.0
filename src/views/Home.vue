<template>
  <div style="height: 600px">
    <lb-table-list
      ref="tableList"
      style="height: 600px"
      :options="tableOption"
      :loading="loading"
    >
      <template slot="startColumn">
        <el-table-column type="selection" />
      </template>
      <template slot="endColumn">
        <el-table-column label="操作" fixed="right" width="140px">
          <!-- <template slot-scope="scope">
            <el-button type="primary"> 取消选择 </el-button>
          </template> -->
        </el-table-column>
      </template>
    </lb-table-list>
  </div>
</template>
<script>
import LbTableList from '_com/lb-table-list'
export default {
  components: {
    LbTableList
  },
  data () {
    return {
      tableList: [],
      tableColumn: [
        {
          columnProps: {
            label: '序号',
            type: 'index',
            fixed: 'left'
          }
        },
        {
          columnProps: {
            label: '直播时间',
            prop: 'playtime'
          }
        },
        {
          columnProps: {
            label: '合作状态111',
            prop: 'status',
            formatter: function (row, column, cellValue) {
              return cellValue ? '合作' : '未合作';
            },
            sortable: true,
            'sort-method': this.sort,
          },
        },
        {
          columnProps: {
            label: '主播',
            prop: 'player',
            width: '200px'
          },
          renderItem: (createElement, sourcedata) => {
            return createElement('div', {
              domProps: {
                innerHTML: `自定义 render：${sourcedata.player}`
              },
              style: {
                padding: '10px',
                background: 'orange',
                color: '#fff',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                borderRadius: '5px',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.clickHandler(sourcedata.player);
                }
              }
            })
          },
        },]
    }
  },
  created () {
    this.requestData();
  },
  computed: {
    tableOption () {
      return {
        props: {
          data: this.tableList,
        },
        tableColumn: this.tableColumn,
        tableEvents: {
          'cell-dblclick': this.handleDBClick,
          'selection-change': this.handleSelectChange,
        },
      };
    },
  },
  methods: {
    sort (a, b, c) {
      console.log('1hoisudhyuadysouasydo', a, b, c);
    },
    // 获取表格数据
    async requestData () {
      this.loading = true
      setTimeout(() => {
        let arr = [];
        for (let i = 0; i < 30; i++) {
          arr.push({
            id: i,
            playtime: 0,
            playtitle: '标题' + i,
            name: '楼盘' + i,
            status: 0 + i,
            cityname: '深圳',
            company: 'Kfang' + i,
            player: '小 KKK',
            playDuration: 300 + i,
            w_count: 0,
            n_count: 12,
            watchtime: 12,
            watchcount: i * 2,
            watchnum: 11,
            watchcountmax: i,
            p_count: i,
            p_num: i,
            commit_num: i + 1,
            commit_count: 30,
            commit_count2: 0,
          })
        }
        this.tableList = arr
        this.loading = false
      }, 200);
    },

    // tableList 双击的回调函数
    handleDBClick (row, column, cell, event) {
      console.log('父组件内部数据：', this.message);
      console.log('内部数据： ', row, column, cell, event);
    },

    // tableList select选项的回调函数
    handleSelectChange (selection) {
      console.log('selection', selection);
    },

    clickHandler (data) {
      console.log(data)
    }
  }
}
</script>
