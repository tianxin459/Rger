//app.js

let tableLog = 'log';
var storage = require('utils/storage.js')
App({
  // storage: {
  //   token: '?sv=2016-05-31&ss=bfqt&srt=sco&sp=rwdlacup&se=2020-03-05T20:51:54Z&st=2017-06-27T12:51:54Z&spr=https&sig=8qwJvDv4i%2FVhV%2F8uYi14B6JkYo45IAfBBoBj3afL92c%3D',
  //   url_data: 'https://ellise.table.core.windows.net',
  //   tableName: 'ettest'
  // },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getInsertUrl:function (table = tableName) {
    table = table || tableName;
    // console.log(url_data + '/' + table + '?' + token);
    return url_data + '/' + table + '?' + token;
  },
  onError: function (msg) {
    console.log('storage => insert log');
    wx.redirectTo({
          url: "../error/error?msg=真抱歉，系统出错了T_T",
        });
    
    // //customer log
    // let url = storage.getInsertUrl(tableLog);
    // let cb_success = resp => {
    //     wx.redirectTo({
    //       url: "../error/error?msg=真抱歉，系统出错了T_T",
    //     });
    //   };
    // let cb_failure = err => {
    //     wx.redirectTo({
    //       url: "../error/error?msg=网络连接好慢啊，请重试",
    //     });
    //   };
    // let data = {
    //   "PartitionKey": "log",
    //   "RowKey": Date.now().toString(),
    //   "msg": msg
    // };
    // console.log(`add log ==> ${url}`);
    // wx.request({
    //   url: url,
    //   method: 'POST',
    //   data: data,
    //   header: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   },
    //   success: cb_success,
    //   fail: cb_failure
    // });

    // console.error("global Error ==> \r\n" + msg);
    // wx.redirectTo({
    //   url: "../error/error?msg='" + msg + "'",
    // });
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
      return this.globalData.userInfo;
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
              return res.userInfo;
            },
            fail: function () {
              // 调用微信弹窗接口
              wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法正常使用"一起哦"的功能体验。请删除小程序重新进入。',
                showCancel:false,
                success: function (res) {
                  wx.redirectTo({
                    url: "../error/error?msg=" + '您点击了拒绝授权，将无法正常使用"一起哦"的功能体验（程序需要您的微信昵称）。请删除小程序重新进入',
                  })
                }
              })
            }
          });
        },
        fail(err) {
          console.log(err);
          wx.redirectTo({
            url: "../error/error?msg='" + '请删除并重新添加小程序，我们需要获取您的微信昵称' + "'",
          });
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    admin:'ellis'
  }
})