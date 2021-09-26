export default {
  filters: {
    date (val, cal = 'YYYY-MM-DD') {
      return this.$moment.moment(val).format(cal)
    },
  },
  methods: {
    // 格式化时间
    formatDate (val = new Date(), cal = 'YYYY-MM-DD') {
      val = val || new Date()
      return this.$moment.moment(val).format(cal)
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
