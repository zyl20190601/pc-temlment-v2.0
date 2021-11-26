<template>
  <div class="about">
    <div class="btn-box">
      <div :class="item.class" v-for="(item, index) in listBtn" :key="item">
        {{ item.leable }} {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      listBtn: [
        {
          leable: '按钮',
          class: ['btn-animation-light'],
        },
        {
          leable: '按钮',
          class: ['btn-animation-bottom-left-up'],
        },
        {
          leable: '按钮',
          class: ['btn-animation-downward-middle-circle'],
        },
      ]
    }
  },
}
</script>
<style lang="scss" scoped>
.btn-box {
  display: flex;
  padding: 50px;
}
</style>
