// 环境变量
const {
  isDev,
  notDev,
  isTest,
  notTest,
  isPro,
  notPro } = require('./env');

/**
 * 接口请求公共参数
 */
const QUERY_INFO_CONFIG = {
  app_id: '20210805872907983955165184',
  version: '1.0',
  charset: 'UTF-8',
  timestamp: '2020-08-22 14:23:11',
}

// MD5 密钥
const key = '9hvxylajb0zzumhyx0g6z6w4ai895mzq'

export {
  key,
  QUERY_INFO_CONFIG,
  isDev,
  notDev,
  isTest,
  notTest,
  isPro,
  notPro
}

