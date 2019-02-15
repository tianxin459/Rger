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
    wx.setStorageSync('logs', logs);
    wx.cloud.init({
      env: 'rger-8907ce'
    });
    // const db = wx.cloud.database();
    // db.collection('todos').add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
    //     description: 'learn cloud database',
    //     due: new Date('2018-09-01'),
    //     tags: [
    //       'cloud',
    //       'database'
    //     ],
    //     // 为待办事项添加一个地理位置（113°E，23°N）
    //     location: new db.Geo.Point(113, 23),
    //     done: false
    //   },
    //   success(res) {
    //     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
    //     console.log('data add success', res)
    //   }
    // });

    // db.collection('todos').doc('XESA5d7E7L4wfUCu').get({
    //   success(res) {
    //     // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    //     console.log(res)
    //   },
    //   fail(err){
    //     console.error(err)
    //   }
    // });
    // console.log('wx.cloud.init', db);
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
              that.globalData.userInfo = res.userInfo;

              //获取额外设置并一并加入userInfo
              storage.getUserConfig(res.userInfo.nickName,
                resp => {
                  console.log('getUserConfig',resp.data);
                  Object.assign(that.globalData.userInfo, resp.data.value[0]);
                });

              typeof cb == "function" && cb(that.globalData.userInfo);
              return res.userInfo;
            },
            fail: function () {
              // 调用微信弹窗接口
              wx.showModal({
                title: '警告',
                content: '请授权使用小程序',
                showCancel:false,
                success: function (res) {
                  wx.redirectTo({
                    url: "../error/error?msg=" + '点击按键授权使用小程序',
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
    admin:'ellis',
    lang:'zh',//zh/en
    langSet:['en','zh'],
    langSetIndex:1,//从1开始这样++时候就是en
  }
})