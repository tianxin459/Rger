// pages/baby/babyfeed.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    feed:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();

    var that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据
      // wx.setStorage({
      //   key: 'userInfo',
      //   data: userInfo,
      // })
      that.setData({
        userInfo: userInfo,
      })
    })
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
  onShareAppMessage: function () {
  
  },

  
  addNote(){
    console.log('add note');
  },

  getData:function(){
    wx.request({
      url: "https://ellise.table.core.windows.net/ettest(PartitionKey='test-pk',RowKey='1498638039425')?sv=2016-05-31&ss=bfqt&srt=sco&sp=rwdlacup&se=2020-03-05T20:51:54Z&st=2017-06-27T12:51:54Z&spr=https&sig=8qwJvDv4i%2FVhV%2F8uYi14B6JkYo45IAfBBoBj3afL92c%3D", //仅为示例，并非真实的接口地址
      method: 'GET',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json',
      },
      success: function (res) {
        console.log(res.data);
      },
      fail: function (err) {
        console.error(err);
      },
      complete: function () {
        wx.hideNavigationBarLoading();
        // wx.hideToast();
        wx.hideLoading();
      }
    })
  }
})