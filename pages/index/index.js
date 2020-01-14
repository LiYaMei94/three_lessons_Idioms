//index.js
//获取应用实例
const app = getApp()
const file = require('../../utils/readFile.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
const util = require("../../utils/util.js")

Page({
  data: {
    data_content: 20,
    userInfo: {},
    hasUserInfo: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    // file.read();
    // read();//使用default共享，import指定属性导入
    // file.read;//当使用new创建的是对象
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      // this.getUserInfo();
    }
  },
  onShareAppMessage:function(){
    const that = this;
    return {
      title: "学习成语利器，一起来玩吧~",
      path: "/pages/index/index",
      success: function (res) {
        util.log("转发成功")
      }
    }
  },
  navigateTo: function(res) {
    if (this.data.hasUserInfo) {
      let clickType = ""
      //直接调用
      if (util.type(res) === 'string') {
        clickType = res;
      } else {
        //按钮点击
        clickType = res.currentTarget.dataset.stu;
      }
      let url = "";
      if (clickType === "game") {
        url = "../game/game";
      } else if (clickType === "my_record") {
        url = "../my_record/my_record"
      } else if (clickType === "rank") {
        url = "../rank/rank"
      }
      wx.navigateTo({
        url: url,
      })
    } else {
      util.showModel("错误", "请授权后使用")
    }
  },
  bindGetUserInfo_game: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.getUserInfo("game");
        } else {
          util.showModel("错误", "请授权后使用")
        }
      }
    })
  },
  bindGetUserInfo_record: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.getUserInfo("my_record");
        } else {
          util.showModel("错误", "请授权后使用")
        }
      }
    })
  },
  getUserInfo: function(flag) {
    const session = qcloud.Session.get()
    if (session) {
      //本地已有登录状态
      qcloud.loginWithCode({
        success: res => {
         console.log(res)
          this.setData({
            userInfo: res,
            hasUserInfo: true
          })
          this.navigateTo(flag)
        },
        fail: err => {
          util.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    } else {
      util.showBusy("正在登录..")
    
      qcloud.login({
        success: res => {
          res = qcloud.Session.get()
          console.log(res)

          app.globalData.userInfo = res;
          app.saveCoin(res.userinfo.coin)

          this.setData({
            userInfo: res,
            hasUserInfo: true
          })
          util.showSuccess('登录成功')
          this.navigateTo(flag)
        },
        fail: err => {
          util.error(err)
          util.showModel('登录错误', JSON.stringify(err))
        }
      })
    }
  }
})