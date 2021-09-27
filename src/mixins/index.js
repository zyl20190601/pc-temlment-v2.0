export default {
  filters: {
    // 格式化时间
    date (val) {
      return new Date(val).format('isoDate')
    },
    dateTime (val) {
      return new Date(val).format('isoDateTime')
    }
  },
  methods: {
    // 格式化时间
    formatDate (val = new Date(), cal = 'isoDate') {
      val = val || new Date()
      return new Date(val).format(cal)
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
