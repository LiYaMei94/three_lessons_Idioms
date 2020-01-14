// pages/game/game.js
const util = require("../../utils/util.js")
import API from "../../common/API.js"
import request from "../../utils/HttpService.js"
const app = getApp();
var timer;
var shareSuccess=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load: false, //是否加载完成
    userInfo: {},
    coin: 0,
    curr: ["", "", "", ""],
    hintIndex: [], //默认提示的字的下标  不可取消
    wordData: {},
    nextWordData: {},
    select: [],
    showModalStatus: false, //是否显示弹窗
    answerRight: false,//回答正确
    progressPercent:0,//进度条
    countTime:5,//倒计时
    progressShow:false,//进度条在出现快速记忆之后才出现
    coinDialog:false,//金币不足弹窗
    hintSuccess:false,//提示成功显示下一题
    fastMemoryShow:false,//快速记忆框
    memoryArr:[],//快速记忆五个成语信息
    currentIndex:0,//当前在第几关
    hintStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    this.setData({
      userInfo: app.globalData.userInfo,
      coin: app.globalData.coin
    })
    util.showBusy("玩命加载中")
    // util.log(app.globalData.userInfo.userinfo.openId)
    // util.log(that.data.userInfo.userinfo.openId)
    // console.log(that.data.userInfo)
    if (that.data.userInfo.userinfo.record==0){
      //无记录
      that.isFastMemory(2)
    }else{
      //有记录
      that.requestNextWord(that.data.coin,false,2)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log(shareSuccess)
    if (shareSuccess !=3){
      shareSuccess = 0
      util.log("转发成功")
      this.powerDrawer("close");
      this.reuqestHelp();
    }else{
      shareSuccess = 0;
      this.reuqestHelp();
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log(1)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    const that = this;
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
    var sharetitle = res.target.dataset.sharetitle;
    var buttonType = res.target.dataset.buttontype;
    shareSuccess = buttonType;
    console.log('buttonType==' + shareSuccess)
    return {
      title: sharetitle,
      path: "/pages/index/index",
      success: function(res) {
        
      }
    }
    
  },
  // 判断是否出现五题的快速记忆
  isFastMemory(type){
    var that=this;
    // console.log(that.data.currentIndex)
    request({
      url: API.memory,
      data: {
        "openId": that.data.userInfo.userinfo.openId
      },
      header: {
        "x-wx-skey": that.data.userInfo.skey
      },
      success: function (res) {
        // console.log(res)
        if (res.length != 0) {
          res.sort(function(){
            return (0.5-Math.random())
          })
          that.setData({
            memoryArr: res
          })
          // console.log(that.data.memoryArr)
        }

      },
      fail: function (res) {

      },
      complete: function () {
        that.requestNextWord(that.data.coin, false, type);
      }
    })
      
  },
  // 倒计时
  countDown() {
    var that = this;
    var count = 5;
    timer = setInterval(function () {
      count = count - 1;
      if (that.data.countTime == 1) {
        //关闭框
        that.powerDrawer('close', 'meony')
        clearInterval(timer)
        that.setData({
          progressShow:true,
          progressPercent:0
        })
      } else {
        that.setData({
          countTime: count
        })
      }
    }, 1700)
  },
  //选字点击
  clickItem: function(e) {
    var clickText = e.currentTarget.dataset.statu;
    //1.判断是否满了 满了还没跳转 答案错误
    var currIndex = this.isCurrFull();
    if (currIndex == 4 && !this.isRight()) {
      util.showFail("答案有误")
    } else {
      var currTemp = this.data.curr == undefined ? ["", "", "", ""] : this.data.curr;
      currTemp[currIndex] = clickText;
      this.setData({
        curr: currTemp
      });
      if (this.isCurrFull() == 4) {
        if (this.isRight()) {
          this.requestAnswerRight()
          this.setData({
            progressPercent: this.data.progressPercent+1
          })
          // console.log(this.data.progressPercent)
        } else {
          util.showFail("答案有误")
        }
      }
    }
  },
  delete: function(e) {
    var deleteIndex = e.currentTarget.dataset.statu;
    if (!this.isRight() && this.data.curr !== undefined && !this.data.hintIndex.some(function(x) {
        return x === deleteIndex
      })) {
      this.data.curr[deleteIndex] = "";
      this.setData({
        curr: this.data.curr
      })
    }
  },
  isRight: function() {
    //正则表达式  g代表全局  所有匹配都替换  否则只替换第一个
    var temp = this.data.curr.toString().replace(/,/g, "");
    return temp == this.data.wordData.word;
  },
  //判断当前选中是否是满的，是的话返回4，否就返回未满下标
  isCurrFull: function() {
    for (var i = 0; i < 4; i++) {
      if (this.data.curr !== undefined) {
        if (this.data.curr[i] == undefined || this.data.curr[i] == "") {
          return i;
        }
      } else {
        return i;
      }
    }
    return 4;
  },
  //提示
  hint: function(e) {
    if (this.isRight()) {
      return;
    }
    //请求提示更改金币
    util.showBusy("")
    const that = this;
    request({
      url: API.changeCoin,
      data: {
        "openId": that.data.userInfo.userinfo.openId,
        "type": 2
      },
      header: {
        "x-wx-skey": this.data.userInfo.skey
      },
      success: function(res) {
        wx.hideToast()
        that.setData({
          hintSuccess:true,
          progressPercent: that.data.progressPercent + 1,
          curr: that.data.wordData.word,
          nextWordData: that.data.wordData,
          currentIndex: that.data.wordData.cnt,
          select: that.data.wordData.words,
          coin:res.coin
        })
        // console.log(that.data.wordData)
        that.powerDrawer('', "pass")
        if ((that.data.currentIndex) % 5 == 0) {
          that.isFastMemory(1)
        } else {
          that.requestNextWord(that.data.coin,true,1);
        }
      },
      fail: function(res) {
        if (res.data.code === -1002) {
          //金币不足
          that.powerDrawer(e,'coin')
          wx.hideToast()
        } else {
          util.showFail(JSON.stringify(data))
        }
      },
      complete: function() {

      }
    })
  },
  //请求服务器  告诉答题正确 增加金币
  requestAnswerRight: function() {
    const that = this;
    request({
      url: API.changeCoin,
      data: {
        "openId": that.data.userInfo.userinfo.openId,
        "type": 1
      },
      header: {
        "x-wx-skey": this.data.userInfo.skey
      },
      success: function(res) {
        console.log(res)
        that.powerDrawer('', "pass")
        that.setData({
          coin:res.coin
        })
        // console.log(that.data.currentIndex)
        if ((that.data.currentIndex) % 5 == 0) {
          that.isFastMemory(1)
        } else {
          that.requestNextWord(that.data.coin,false,1);
        }
      },
      fail: function(res) {
        util.showFail(JSON.stringify(res))
      },
      complete: function() {

      }
    })
  },
  //求助增加金币
  reuqestHelp: function() {
    util.showBusy("")
    const that = this;
    request({
      url: API.changeCoin,
      data: {
        "openId": that.data.userInfo.userinfo.openId,
        "type": 3
      },
      header: {
        "x-wx-skey": this.data.userInfo.skey
      },
      success: function(res) {
        util.log(res)
        // 增加金币
        that.setData({
          coin: res.coin
        })
        app.saveCoin(res.coin)
        wx.hideToast()
      },
      fail: function(res) {
        util.showFail(JSON.stringify(res))
      },
      complete: function() {

      }
    })
  },
  //请求刷新题目
  requestNextWord: function (coinData, hintStatus,type) {
    util.showBusy("")
    const that = this;
    request({
      url: API.requestWord,
      data: {
        "openId": that.data.userInfo.userinfo.openId,
        "t": type
      },
      header: {
        "x-wx-skey": this.data.userInfo.skey
      },
      success: function(res) {
        util.log(res)
        wx.hideToast()
        that.data.curr = [res.word.charAt(0), "", "", ""];
        that.data.hintIndex = [0]
        //增加随机提示一个字
        var secondIndex = Math.ceil(Math.random() * 3);
        that.data.hintIndex[1] = secondIndex;
        that.data.curr[secondIndex] = res.word.charAt(secondIndex);
        //如果是提示
        if (hintStatus){
          that.setData({
            hintSuccess:true,
          })
        }
        // 如果有提示
        if (that.data.fastMemoryShow){
          that.setData({
            progressPercent: that.data.progressPercent + 1
          })
        }
        if(type==1){
          that.setData({
            nextWordData: that.data.wordData,
          })
        }else{
          that.setData({
            nextWordData: res,
            load: true,
          })
        }
        that.setData({
          curr: that.data.curr,
          coin: that.data.coin,
          currentIndex: res.cnt,
          wordData: res,
          select: res.words,
          hintIndex: that.data.hintIndex,
        })
        // console.log(that.data.currentIndex)
        app.saveCoin(that.data.coin)
      },
      fail: function() {
        util.log("失败")
        util.showModel("错误", "加载失败，请稍后重试~")
      },
      complete: function() {
        wx.hideToast()
      }
    })
  },
  //点击切换下一题
  next: function() {
    this.setData({
      answerRight: false,
      hintSuccess: false,
      showModalStatus: false,//切换下一题弹框关闭
      hintStatus: false,//提示
    })
    // 判断是否出现快速记忆框
    if ((this.data.currentIndex-1) % 5 == 0){
      this.powerDrawer('open','meony')
    }
  },
  //打开/关闭弹窗
  powerDrawer: function(e,type) {
    var currentStatu = "";
    var dialogStatus=''
    if (util.type(e) === 'string') {
      //来自内部的调用
      currentStatu = e;
    } else {
      //点击事件的调用
      currentStatu = e.currentTarget.dataset.statu;
      dialogStatus = e.currentTarget.dataset.dialogstatus;
    }
    this.util(currentStatu, dialogStatus,type)
  },
  //执行动画
  util: function (currentStatu, dialogStatus,type) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function() {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
        if (dialogStatus=="pass"){
          this.next()
        } else if (dialogStatus =="coin"){
          this.setData({
            coinDialog:false
          })
        }else{
          this.setData({
            fastMemoryShow: false
          })
        }
      }
    }.bind(this), 200)
    // 显示 
    if (currentStatu != "close") {
      this.setData({
        showModalStatus: true
      });
      if (type=='coin'){
        this.setData({
          coinDialog:true
        })
      } else if (type=="pass"){
        this.setData({
          answerRight:true
        })
      } else if (type=="meony"){
        this.setData({
          fastMemoryShow: true,
          countTime: 5,
        })
        this.countDown()
      }
    }
    console.log(this.data.showModalStatus)
  }
})