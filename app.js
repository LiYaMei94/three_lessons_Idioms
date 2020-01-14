//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
import API from './common/API.js'

App({
  onLaunch: function() {
    // wx.clearStorage()
    qcloud.setLoginUrl(API.login)
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    const session = qcloud.Session.get() || null;
    this.globalData.userInfo = session;
    this.globalData.coin = wx.getStorageSync('coin') || 0;

    // // 是否打开调试  发布版需要关闭!!!!!!!!!!
    wx.setEnableDebug({
      enableDebug: false
    })

  },
  // 保存金币的值
  saveCoin: function(coin) {
    this.globalData.coin = coin;
    wx.setStorageSync('coin', coin)
  },
  reset: function() {
    this.globalData.userInfo = null;
    this.globalData.coin;
  },
  globalData: {
    userInfo: null,
    coin: null,
    //是否打开console.log 发布版需要关闭!!!!!!!!!!!!!!!!!!
    logEnable: true
  }
})