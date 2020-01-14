// pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_rank:999,
    list:[
      { "portrait":"../../images/test_1.png",name:"佩奇",gold:"999",level:"777"},
      { "portrait": "../../images/test_2.png", name: "狗斯基", gold: "888", level: "666" },
      { "portrait": "../../images/test_3.png", name: "645", gold: "777", level: "555" },
      { "portrait": "../../images/test_4.png", name: "单反", gold: "666", level: "444" },
      { "portrait": "../../images/test_5.png", name: "礼拜天", gold: "555", level: "333" },
      { "portrait": "../../images/test_1.png", name: "佩奇", gold: "999", level: "777" },
      { "portrait": "../../images/test_1.png", name: "佩奇", gold: "999", level: "777" },
      { "portrait": "../../images/test_1.png", name: "佩奇", gold: "999", level: "777" },
      { "portrait": "../../images/test_1.png", name: "佩奇", gold: "999", level: "777" },
      { "portrait": "../../images/test_1.png", name: "佩奇", gold: "999", level: "777" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'image') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我的排行',
      path: '/pages/rank/rank'
    }
  }
})