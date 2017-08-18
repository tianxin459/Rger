//index.js
//获取应用实例
var app = getApp();
var data = require('../../utils/data.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    userInfoStr:'',
    showLocation:false,
    locations:[],
  },
  //事件处理函数
  bindViewTapFn: function () {
    console.log('on tap ')
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindTap1: function () {
    wx.navigateTo({
      url: '../page2/page2'
    })
  },
  bindTap2: function () {
    // wx.navigateTo({
    //   url: '../page2/page2'
    // })
    wx.showNavigationBarLoading();

    wx.showLoading({
      title: 'enrolling',
      mask:true
    })
    // wx.showToast({
    //   title: 'loading',
    //   icon: 'loading'
    // })


    wx.request({
      url: 'https://httpbin.org/ip', //仅为示例，并非真实的接口地址
      method: 'GET',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json'
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
  },
  gotoClick:function(){
    this.setData({
      showLocation:!this.data.showLocation
    });
  },
  signUp:function(e){
    console.debug(e);
    wx.openLocation({
      name: '张江实验小学',
      latitude: 31.201270,
      longitude: 121.594740, 
      scale: 28,         
    });
     
  },
  openMap:function(e){
    console.log(e);
    let locationData = e.target.dataset;
    wx.openLocation({
      name: locationData.name,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      scale: 50,
    });
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      // wx.setStorage({
      //   key: 'userInfo',
      //   data: userInfo,
      // })
      console.log(data.locations.location);
      that.setData({
        userInfo: userInfo,
        locations: data.locations.location,
        // userInfoStr: JSON.stringify(userInfo, null, 2).replace(/\n/g, '\n')
      })
    })
  }
})
