/**
 * 全局过滤器
 */

// yyyy-mm-dd
const date = (val) => {
  return new Date(val).format('isoDate')
}

// yyyy-mm-dd HH:MM:ss
const dateTime = (val) => {
  return new Date(val).format('isoDateTime')
}

export {
  date,
  dateTime
}
