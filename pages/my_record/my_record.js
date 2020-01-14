// pages/my_record/my_record.js
const util = require("../../utils/util.js")
import API from "../../common/API.js"
import request from "../../utils/HttpService.js"
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:false,
    grids: [], //num 序号  name 关卡名  status 状态,
    pageNum:1,
    loadEnd:false,//是否加载完成,
    userInfo:{},
    idiomTitle:'',
    showModalStatus:false,
    gridItem:{},//点击成就的那条数据
    showModal:false,
    content: '亲，这关还没过呢，前去闯关吧!',
    dialogBtnActive:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    util.showBusy("玩命加载中")
    this.reuqestNext()
  },
  reuqestNext:function(){
    const that=this;
    if(this.data.loadEnd){
      return;
    }
    request({
      url: API.myRecord,
      data: {
        "openId": that.data.userInfo.userinfo.openId,
        "page": that.data.pageNum,
        "type":1
      },
      header: {
        "x-wx-skey": this.data.userInfo.skey
      },
      success:function(res){
        util.log(res)
        let record = that.data.grids.concat(res);
        if(res.length<50){
          record = record.concat("????")
        }
        that.setData({
          grids: record,
          loadEnd: res.length < 50,
          pageNum: that.data.pageNum+1,
          load:true
        })
        wx.hideToast()
      },
      fail:function(res){
        util.showFail(JSON.stringify(res))
      },
      complete:function(){

      }
    })
  },
  scrolltolower:function(){
    this.reuqestNext()
  },
  //打开/关闭弹窗
  powerDrawer: function (e) {
    var currentStatu = "";
    var chengyuIndex = 0;
    var item=''
    if (util.type(e) === 'string') {
      //来自内部的调用
      currentStatu = e;
    } else {
      //点击事件的调用
      currentStatu = e.currentTarget.dataset.statu;
      chengyuIndex = e.currentTarget.dataset.chengyuindex;
      item = e.currentTarget.dataset.item;
    }
    if(item=='????'){
      this.setData({
        showModal:true,
        
      })
    }else{
      this.util(currentStatu, chengyuIndex)
    }
    
  },
  //执行动画
  util: function (currentStatu, chengyuIndex) {
    var grids = this.data.grids;
    var gridItem = {};
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
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false,
        });
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      gridItem = grids[chengyuIndex]
      this.setData({
        showModalStatus: true,
        gridItem: gridItem
      });
    }
  },
  onClickDeleteOp(e){
    console.log(e)
    let type = e.currentTarget.dataset.type;
    var that = this;
    if (type) {
      wx.redirectTo({
        url: '../game/game'
      })
    }
    that.setData({
      showModal:false
    })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
  onShareAppMessage: function () {
    const that = this;
    let content = that.data.grids.length < 50 ? that.data.grids.length-1:"超过50";
    return {
      title: "我已经答对" + content +"题，你敢来挑战吗？",
      path: "/pages/index/index",
      success: function (res) {
        util.log("转发成功")
      }
    }
  }
})