
import Vue from 'vue'

const COMPONENT_NAME = 'kf-dynamic-component'

export default Vue.component(COMPONENT_NAME, {
  name: COMPONENT_NAME,
  props: {
    renderMethod: {
      type: Function,
      required: true
    },
    sourceData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  render (createElement) {
    if (this.renderMethod) {
      return this.renderMethod(createElement, this.sourceData)
    } else {
      return null
    }
  }
})
