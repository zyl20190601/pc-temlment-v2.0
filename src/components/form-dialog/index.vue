<template>
  <el-dialog
    :title="title"
    class="choose-table-dialog"
    :visible="isShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="width"
    top="10vh"
    @close="close"
  >
    <el-form
      v-show="isShow"
      v-loading="loading"
      :disabled="allDisabled"
      :model="formData"
      class="rule-form"
      :class="allDisabled ? 'all-disabled-form' : ''"
      ref="ruleForm"
      label-position="left"
    >
      <el-col
        v-for="(item, index) in formGroup"
        :key="index"
        :span="item.colSpan ? item.colSpan : 24"
        :v-show="item.isHidden"
      >
        <el-form-item
          :label="item.label"
          :label-width="item.labelWidth || '105px'"
          :prop="item.value"
          :style="{ 'text-align': item.align || 'left' }"
          :rules="allDisabled ? [] : item.rules"
        >
          <template
            v-if="
              item.targetElement !== 'slot' && item.targetElement !== 'text'
            "
          >
            <component
              :is="item.targetElement"
              v-bind="item.props"
              v-on="item.targetEvent"
              :data="item.targetElement === 'el-table' ? item.data : ''"
              :class="item.class"
              :style="item.style"
              v-model.trim="formData[item.value]"
            >
              <template v-if="childrenNodeAttrName[item.targetElement]">
                <component
                  :is="childrenNodeAttrName[item.targetElement]"
                  v-for="optionItem in item.options"
                  :key="
                    optionItem[item.optionAlias.key] ||
                    optionItem[item.optionAlias.value]
                  "
                  :width="optionItem[item.optionAlias.width]"
                  :prop="optionItem[item.optionAlias.prop]"
                  :label="optionItem[item.optionAlias.label]"
                  :value="optionItem[item.optionAlias.value]"
                />
              </template>
            </component>
          </template>

          <!-- 自定义 -->
          <slot
            v-if="item.targetElement === 'slot'"
            :name="item.slotName"
          ></slot>
          <!-- text展示 -->
          <span class="text-tips" v-if="item.targetElement === 'text'">
            {{ item.textTitle ? item.textTitle : formData[item.value] }}
          </span>
        </el-form-item>
      </el-col>
    </el-form>
    <template slot="footer" v-if="isFooter">
      <el-button @click="leftSubmit">{{ leftBtnText }}</el-button>
      <el-button type="primary" @click="rightSubmit">{{
        rightBtnText
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    width: { // 弹窗宽度
      type: String,
      default: '800px'
    },
    title: { // 弹窗title
      required: true,
    },
    isShow: {
      type: Boolean,
      required: true,
      default: false
    },
    forml: {
      type: Boolean,
      default: false
    },
    allDisabled: { // 是否全部禁用
      type: Boolean,
      default: false
    },
    formGroup: { // 表单配置参数
      type: Array,
      required: true,
      default: () => []
    },
    formData: {  // 表单数据
      // type: {},
      required: true,
    },
    isFooter: {  // 底部确定栏显示
      type: Boolean,
      default: true
    },
    isClickLeftHideDialog: {  // 是否点击左边按钮隐藏弹框
      type: Boolean,
      default: true
    },
    leftBtnText: {  // 左边按钮文字显示
      default: '取消'
    },
    rightBtnText: {  // 右边按钮文字显示
      default: '确认'
    },
    rightSubmitApi: {  // 右边按钮 api
      default: ''
    },
  },
  data () {
    return {
      loading: this.forml,
      childrenNodeAttrName: {
        // 获取子级 选择下拉、复选框、单选、表格 dom
        'el-select': 'el-option',
        'el-checkbox-group': 'el-checkbox',
        'el-radio-group': 'el-radio',
        'el-table': 'el-table-column'
      }
    }
  },
  watch: {
    'forml' (val) {
      this.loading = val
    },
    'isShow' (val) {
      // 重置表单
      val && this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields()
    }
  },
  methods: {
    // 单个字段验证
    validateFieldProp (prop) {
      let formValidate = false
      this.$refs.ruleForm.validateField(prop, (valid) => {
        formValidate = !valid
      })
      return formValidate
    },
    //右边 提交时验证表单
    rightSubmit () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          const query = {}
          for (let index = 0; index < this.formGroup.length; index++) {
            const { notQuery, value, textTitle } = this.formGroup[index]
            if (!notQuery && !textTitle) {
              query[value] = this.formData[value]
            }
          }
          if (this.rightSubmitApi) {
            await this.rightSubmitApi(query)
            this.close()
            return
          }
          this.$emit('rightSubmit', query)
        } else {
          this.$message.warning('请把信息填写完整！')
        }
      })
    },
    // 左边按钮提交
    leftSubmit () {
      if (this.isClickLeftHideDialog) {
        this.close()
      }
      this.$emit('leftSubmit')
    },
    // 关闭弹窗
    close () {
      this.$emit('update:isShow', false)
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
$width: 100%;

.choose-table-dialog {
  .rule-form {
    height: calc(100%);
    position: inherit !important;
  }
  .el-textarea {
    width: 100%;
  }
}

::v-deep {
  .el-dialog {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    overflow: hidden;
    .el-dialog__header {
      text-align: left;
    }
    .el-form {
      .el-form-item__label {
        text-align: right;
        font-size: 15px;
      }
      .el-form-item {
        margin-bottom: 8px;
      }

      .el-input {
        width: $width;
      }

      .el-select {
        width: $width;
      }

      .el-date-editor.el-input {
        width: $width;
      }

      .el-range-editor--small.el-input__inner {
        width: 280px;
      }

      .el-date-editor .el-range-separator {
        width: 20px !important;
      }
    }

    .all-disabled-form {
      .el-input__inner,
      .el-textarea__inner {
        background: none;
        border: none;
        color: #000;
        &:hover {
          cursor: default;
        }
      }
      .el-date-editor {
        .el-input__inner {
          background: #f5f7fa;
          border: 1px solid #e4e7ed;
          &:hover {
            cursor: default;
          }
        }
      }
      .el-textarea__inner,
      .el-checkbox-group {
        padding-left: 10px;
        &:hover {
          cursor: default;
        }
      }
      .el-switch,
      .el-date-editor {
        margin-left: 10px;
        &:hover {
          cursor: default;
        }
      }
      .el-input__suffix {
        width: 0;
        height: 0;
        overflow: hidden;
      }
      .el-textarea {
        position: relative;
        &::before {
          position: absolute;
          display: block;
          content: '';
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          z-index: 999;
          background-color: #fff;
        }
      }
      .text-tips {
        font-size: 15px;
        // padding-left: 10px;
      }
      // span {
      //   color: #000;
      // }
    }
  }
}
</style>
