import {
  HEADER
} from '../common/API'
import API from '../common/API'
const util = require("./util.js")
var qcloud = require('../vendor/wafer2-client-sdk/index')
const app=getApp();

const request = function(options) {
  if (util.type(options) === 'string') {
    options = {
      url: options
    }
  } else {
    var {
      url,
      success,
      fail,
      complete,
      header,
      data
    } = options
  }
  // 如果传入的原始配置没有header，则用默认的替代
  if (!header) {
    options.header = HEADER
  } else {
    options.header = util.extend(options.header, HEADER)
  }
  options.data = JSON.stringify(options.data)
  options.dataType = "json";
  options.method = "POST";


  try {
    options = util.extend(options, {
      success(res) {
        const {
          errMsg,
          statusCode,
          data
        } = res
        util.log(url + "返回的数据：" + res)
        if (statusCode == 200 && errMsg === 'request:ok') {
          const {
            code,
            data,
            msg
          } = res.data;
          if (code === 0) {
            success(data)
          } else {
            util.log(res)
            if (code === -1 | code === -1001) {
              //需要重新登录 或用户不存在
              wx.clearStorage()
              app.reset()

              util.showModel("提示","登录失效，请重新登录",function(res){
                if (res.confirm){
wx.reLaunch({
                url: '/pages/index/index',
              })
                }
              })
              
            } else {
              fail(res);
            }
            // util.showFail(msg)
          }
        } else {
          util.log(res)
          // util.showFail(res)
          fail(res);
        }
      },
      fail(res) {
        util.log(res);
        fail(res);
      },
      complete(res) {
        complete();
      }
    })
    wx.request(options)

  } catch (e) {
    util.log(e)
  }
}

export default request