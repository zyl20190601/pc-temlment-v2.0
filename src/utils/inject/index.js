import '../date_format'

function inject (target, methodName, callback) {
  if (!target || !methodName || !callback) return console.warn(`注入方法 -->${target} -- ${methodName} --${callback} 失败`);
  Object.defineProperty(target, methodName, {
    writable: true,
    enumerable: false, // 不可枚举
    configurable: true,
    value: callback,
  });
}

/**
 * 去除前后空格
 */
inject(String.prototype, 'Trim', function (isGlobal = false) {
  if (isGlobal) {
    // 是否删除所有空格
    return this.replace(/\s/g, '');
  }
  return this.replace(/(^\s*)|(\s*$)/g, '');
});

// 判断是否为身份证号 支持15位和18位
inject(String.prototype, 'isIdCard', function () {
  return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/.test(
    this.Trim()
  );
});

// 是否是email
inject(String.prototype, 'isEmail', function () {
  return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.Trim());
});

// 是否是手机
inject(String.prototype, 'isMobile', function () {
  return /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(this.Trim());
});

// 判断是否为url
inject(String.prototype, 'isUrl', function () {
  // eslint-disable-next-line no-useless-escape
  return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(this.Trim());
});

/**
 * 格式化 手机号空格 19800000000 ===>  198 0000 0000
 */
inject(String.prototype, 'phoneSpace', function () {
  return this.replace(/(\d{3})(\d{4})/, '$1 $2 ');
});

//将字符串中的key给整出来，通常用于url里面的key=value value获取
inject(String.prototype, 'query', function (key) {
  let _result = {};
  this.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (_result[k] = v));
  return _result[key];
});

// 移除数组中某个元素
inject(Array.prototype, 'remove', function (val) {
  let index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
  return this;
});
