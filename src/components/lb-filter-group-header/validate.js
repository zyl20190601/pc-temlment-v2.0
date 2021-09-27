export function validateType (target, type) {
  if (typeof type !== 'string') {
    type = type.toString()
  }
  return Object.prototype.toString.call(target) === `[object ${type}]`
}

// 打印log函数
const showLog = (msg, type = 'error') => {
  console[type](`props出错：${msg}`)
}

// props校验函数
export const validateProps = (value) => {
  const aliasKeyMap = ['label', 'value', 'key']
  for (const val of value) {
    const {
      targetElement,
      targetElementEvents,
      value,
      props,
      sourceData,
      responseTemplate,
      formatDataFunc,
      optionAlias,
      separateQuery
    } = val
    if (typeof targetElement !== 'string') {
      showLog('targetElement的类型应该为string类型')
      return false
    } else if (
      targetElementEvents &&
      !validateType(targetElementEvents, 'Object')
    ) {
      showLog('targetElementEvents的类型应该为object类型')
      return false
    } else if (targetElement !== 'slot' && typeof value !== 'string') {
      showLog('value的类型应该为string类型')
      return false
    } else if (props && !validateType(props, 'Object')) {
      showLog('props的类型应该为object类型')
      return false
    } else if (
      sourceData &&
      !validateType(sourceData, 'Function') &&
      !Array.isArray(sourceData)
    ) {
      showLog('sourceData的类型应该为function或array类型')
      return false
    }
    if (responseTemplate && typeof responseTemplate !== 'string') {
      showLog('responseTemplate的类型应该为string类型')
      return false
    } else if (formatDataFunc && !validateType(formatDataFunc, 'Function')) {
      showLog('formatDataFunc的类型应该为function类型')
      return false
    } else if (optionAlias) {
      const validateAlias = aliasKeyMap.every((item) => {
        return Object.keys(optionAlias).includes(item) && optionAlias[item]
      })
      if (!validateType(optionAlias, 'Object')) {
        showLog('optionAlias的类型应该为object类型')
        return false
      } else if (!validateAlias) {
        showLog(
          'optionAlias对象必须包含\'label\', \'value\', \'key\'这三个字段，且值不能为空'
        )
        return false
      }
    } else if (separateQuery && !validateType(separateQuery, 'Object')) {
      showLog('separateQuery的类型应该为object类型')
      return false
    }
  }
  return true
}
