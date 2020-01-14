const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime,
  showSuccess,
  showFail,
  showBusy,
  showModel,
  extend,
  type,
  objectToQueryString,
  isNullObject,
  isPlainEmptyObject,
  isEmptyObject,
  isPlainObject,
  log
}

// ===================================
/**
 *  三种吐司
 * */
export function showSuccess() {
  wx.showToast({
    title: arguments[0] ? arguments[0] : "",
    icon: "success",
    duration: arguments[1] ? arguments[1] : 1500
  })
}
export function showFail() {
  wx.showToast({
    title: arguments[0] ? arguments[0] : "",
    icon: "none",
    duration: arguments[1] ? arguments[1] : 1500
  })
}
export function showBusy() {
  wx.showToast({
    title: arguments[0] ? arguments[0] : "加载中",
    icon: "loading",
    duration: arguments[1] ? arguments[1] : 10000
  })
}
export function showModel() {
  let title = arguments[0]
  let content = arguments[1]
  if (isEmptyObject(content) | isNullObject(content)) {
    showFail(title)
    return;
  }
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false,
    success: arguments[2]
  })
}

/**log */
function log(content) {
  if (app.globalData.logEnable) {
    console.log(content)
  }
}

/**
 * 对象转string参数   {name:'小明',age:18} -> name=小明&age=18
 */
export function objectToQueryString(dataObject) {
  if (!dataObject || typeof dataObject !== 'object') {
    return ''
  }
  const kvArr = []
  Object.keys(dataObject).forEach(key => kvArr.push(`${key}=${dataObject[key]}`))
  return kvArr.join('&')
}

/*
  判断传入的参数的类型
*/
export function type(arg) {
  const t = typeof arg
  return t === 'object' ?
    arg === null ?
    'null' :
    Object.prototype.toString.call(arg).slice(8, -1).toLowerCase() :
    t
}
/**
 * 判断Null
 */
export function isNullObject(obj) {
  return obj == null ?
    true :
    isPlainEmptyObject(obj) ?
    true :
    false
}
/*
  判断一个对象是否是plain empty object
*/
export function isPlainEmptyObject(obj) {
  if (!isPlainObject(obj)) {
    return false;
  }
  return isEmptyObject(obj);
}

/*
   判断一个数组和对象是否是empty
   只要传入的obj对象没有emunerable=true的属性，就返回true
*/
export function isEmptyObject(obj) {
  var name;
  for (name in obj) {
    return false;
  }
  return true;
}

// 判断是否为普通对象
// 即简单的字典
// { id:xx, name:xx } -> true
export function isPlainObject(obj) {
  let key;
  // 过滤非对象和global对象
  // 小程序中可以认为wx就是global
  if (type(obj) !== 'object') {
    return false;
  }
  const hasOwn = Object.prototype.hasOwnProperty;
  // 这个对象不能是自定义构造器new 出来的
  // 且对象构造器的prototype属性必须有自己的 isPrototypeOf 属性（其实判断7个内置属性都行，不一定非要判断这个）...
  if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype || {}, 'isPrototypeOf')) {
    return false;
  }
  // key in 会先遍历自有属性，如果最后一个属性都是自有属性的话，说明整个
  // 对象上所有属性都是自有属性，说明这个对象就是一个简单的字典
  for (key in obj) {}
  return key === void 0 || hasOwn.call(obj, key);
}


// 对象拷贝（复制）工具方法。类似于jQuery的extend方法
export function extend(...args) {
  let options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = args[0] || {},
    i = 1,
    length = args.length,
    deep = false;
  // log( args );
  // 第一个参数作为是否是深拷贝的flag
  if (typeof target === 'boolean') {
    deep = target;
    target = args[i] || {};
    // 跳过第一个参数
    i++;
  }
  // 只有对象和函数可extend
  // 保证target一定为对象
  if (typeof target !== 'object' && !Utils.isFunction(target)) {
    target = {};
  }
  if (i === length) {
    // 如果除了deep之外只有一个参数，那么就把target指向this （this是Utils对象）
    // target = {};
    i--;
  }
  // 处理deep和target之后的参数
  for (; i < length; i++) {
    if ((options = args[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        // 在copy中有引用target，导致死循环
        if (target === copy)
          continue
        // 对象和数组分开处理。加快拷贝速度
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ?
              src : [];
          } else {
            clone = src && isPlainObject(src) ?
              src : {};
          }
          // 递归
          target[name] = extend(deep, clone, copy);
        } else if (copy !== void 0) { // 不是深拷
          target[name] = copy;
        }
      }
    }
  }
  // return出去改变过后的对象
  return target;
}