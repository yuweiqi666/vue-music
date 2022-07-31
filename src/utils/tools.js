// 识别手机系统  iphone 或者 android
export const getMobileOs = () => {
  const os = navigator.userAgent
  if (os.indexOf('Android') !== -1) {
    return 'android'
  } else if (os.indexOf('iPhone') !== -1) {
    return 'ios'
  } else if (os.indexOf('Windows') !== -1) {
    return 'pc'
  } else if (os.indexOf('iPad') !== -1) {
    return 'ipad'
  } else {
    return 'unknown'
  }
}

// 自动化导入模块
export const getDirTogether = (modulePath, initValue) => {
  const result = Array.isArray(initValue) ? [] : {}
  const keys = modulePath.keys()

  keys.forEach(key => {
    if (result instanceof Array) {
      result.push(modulePath(key).default)
    } else {
      const fileName = key.replace(/^\.\/(.*)\.\w+$/, '$1')
      result[fileName] = modulePath(key).default
    }
  })

  return result
}

// 获取0~x之间的随机数 前闭后开
export const getRandomNum = (num = 1) => {
  return Math.round(Math.random() * num)
}

// 节流函数
export const trottle = (fn, time) => {
  let previous = 0
  let timer
  return function () {
    const now = +new Date()
    if (now - previous >= time) {
      fn.apply(this, arguments)
      previous = now
    } else if (!timer) {
      const delay = time - (now - previous)
      timer = setTimeout(() => {
        fn.apply(this, arguments)
        previous = +new Date()
        timer = null
      }, delay)
    }
  }
}
