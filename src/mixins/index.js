const moment = require('moment');

export default {
  // data () {
  //   return {

  //   };
  // },
  // beforeRouteEnter (to, from, next) {
  //   // // 只有这几个页面 缓存
  //   if (to.meta.keepAlivePath.includes(from.path)) {
  //     to.meta.isBack = true;
  //   } else {
  //     to.meta.isBack = false;
  //   }
  //   next();
  // },
  // beforeRouteLeave (to, from, next) {
  //   next();
  // },
  // async activated () {
  // },
  // mounted () {
  // },
  created () {
    this.loadData()
  },
  filters: {
    date (val, cal = 'YYYY-MM-DD') {
      return moment(val).format(cal)
    },
  },
  methods: {
    // 加载数据
    async loadData () { },
    // 格式化时间
    formatDate (val = new Date(), cal = 'YYYY-MM-DD') {
      val = val || new Date()
      return moment(val).format(cal)
    },
    // 跳转
    jump (path, query = {}) {
      this.$router.push({
        path,
        query,
      });
    }
  },
};
