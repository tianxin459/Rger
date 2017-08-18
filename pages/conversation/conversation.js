// pages/conversation/conversation.js

var app = getApp();
var storage = require('../../utils/storage.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    messageList: [],
    requesting:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    app.getUserInfo(userInfo => {
      that.setData({
        userInfo: userInfo
      })
    },
      e => {
        console.error(e);
      });
    let count = 0;
    setInterval(() => {
      if(!that.data.requesting)
      {
        console.log('go request');
        that.loadMessage('1');
      }
    }, 3000)

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
  addMessage(e) {
    console.log(e.detail.value.message);
    let msg = e.detail.value.message;
    let data = {
      "PartitionKey": "message",
      "RowKey": Date.now().toString(),
      "creator": this.data.userInfo.nickName,
      "activiteId": '1',
      "message": msg
    };
    storage.insertConversation(data,
      resp => {
        console.log('success add message');
        console.log(resp);
      })
  },
  loadMessage(activiteId) {
    let that = this;
    that.setData({
      requesting: true
    });
    storage.getMessageByActiviteId(activiteId,
      resp => {
        that.setData({
          messageList: resp.data.value,
          requesting:false
        });
      }
    );
  }
})