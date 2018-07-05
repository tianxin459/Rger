// pages/activiteDetail/activiteDetail.js
var app = getApp();
var storage = require('../../utils/storage.js');
var util = require('../../utils/util.js');
let messageLoader;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: false,
    dateNow: '',
    onShare:false,
    menuDisplay:true,
    showHelp: false,
    loading: true,
    title: '',
    content: '',
    userList: [],
    userInfo: {},
    activite: {},
    activiteId: '',
    joinAlready: false,
    activiteLocation: {},
    messageList: [],
    requesting: true,
    openMessageBoard: false,
    message: '',
    lastMessageRowKey: '',
    messageEntering: false,
    lastMessage: '',
    teamGroup: [],
    kickOutEnable:false,
  },
  onShow: function (e) {
    let that = this;
    messageLoader = setInterval(() => {
      if (!that.data.requesting) {
        that.loadMessage(that.data.activiteId);
      }
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let finishUser = false;
    let finishdData = false;
    let filterStr = "$filter=RowKey%20eq%20'" + options.id + "'";
    let data_userInfo;
    let data_title;
    let data_content;
    let data_activite;
    let data_activiteId;
    let data_activiteLocation;
    let data_requesting;
    let data_loading;

    app.getUserInfo(function (userInfo) {
      data_userInfo = userInfo;
      finishUser = true;

      storage.queryData(filterStr,
        resp => {
          let a = resp.data.value[0];
          let day = (new Date(a.date||Date())).getDay();
          a.dayOfWeek = util.weekDay[day];
          a.location = a.location || '{}';
          data_title = a.title;
          data_content = a.content;
          data_activite = a;
          data_activiteId = options.id;
          data_activiteLocation = JSON.parse(a.location);
          data_requesting = false;
          finishdData = true;
          let isAdminFlag = app.globalData.admin == data_userInfo.nickName;

          let isAdminDate = isAdminFlag ? '1980-01-01' : util.formatTime(new Date()).replace(/\d{2}:\d{2}:\d{2}/, '').trim();
          that.setData({
            isAdmin: isAdminFlag,
            dateNow: isAdminDate,
            userInfo: data_userInfo,
            title: data_title,
            content: data_content,
            activite: data_activite,
            activiteId: data_activiteId,
            activiteLocation: data_activiteLocation,
            requesting: data_requesting,
          });
          // let userInfo = this.data.userInfo;
          that.loadUserList(options.id);
        },
        err => console.error(err)
      );
    },
      function (e) {
        console.error(e);
      });


    // console.log('load userlist aid=' + options.id);

    // that.loadMessage(options.id);
    // //load message
    // messageLoader = setInterval(() => {
    //   if (!that.data.requesting) {
    //     // console.log('go request ' + options.id);
    //     that.loadMessage(options.id);
    //   }
    // }, 1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    clearInterval(messageLoader);
    // let messageListErr = that.data.messageList;
    // messageListErr.push({
    //   creator: 'System',
    //   message: '留言板连接已断开，请重新进入页面'
    // });
    // that.setData({
    //   messageList: messageListErr,
    //   requesting: false
    // });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(messageLoader);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({ menuDisplay:false});
    let that = this;
    return {
      title: this.data.activite.title,
      desc: this.data.activite.content,
      path: '/pages/activiteDetail/activiteDetail?id=' + this.data.activiteId,
      success: function (res) {
        console.log('分享成功');
        that.setData({ menuDisplay: true });
      },
      fail: function (res) {
        console.error('分享失败');
        console.error(res);
        that.setData({ menuDisplay: true });
      }
    }
  },
  /*
  *私有功能函数
  */

  loadUserList(activiteId) {
    let that = this;
    // console.log('actId=' + activiteId);
    storage.loadUserList(activiteId,
      resp => {
        let enrolledflag = false;
        let userInfo = that.data.userInfo;
        for (let i of resp.data.value) {
          if (i.nickName == userInfo.nickName) {
            enrolledflag = true;
            break;
          }
        }
        console.log(userInfo.nickName + '|' + enrolledflag);
        let userList = resp.data.value;
        let updateNumberFlag = userList.length != that.data.userList.length
        //for testing -start
        // for(var it = 0;it<12;it++)
        // {
        //   userList.push(userList[0]);
        // }
        //for testing -end

        that.setData({
          userList: userList,
          joinAlready: enrolledflag,
          loading: false
        });
        if (updateNumberFlag) {
          // console.log('loadUserList=>updateNumber');
          storage.updateActiviteUserNumber(that.data.activiteId, userList.length);
        }
      },
      e => {
        console.log(e);
      });
  },
  quitAct(userNickname) {
    
    for (let i in this.data.userList) {
      if (this.data.userList[i].nickName == userNickname) {
        // console.log(this.data.userList[i]);
        storage.deleteData(this.data.userList[i].PartitionKey,
          this.data.userList[i].RowKey,
          resp => {
            this.loadUserList(this.data.activiteId);
            wx.hideLoading();
          });
        break;
      }
    }
  },
  updateActivite(e) {
    wx.redirectTo({
      url: '../activite/activite?id=' + this.data.activiteId
    });
  },
  copyActivite(e) {
    wx.redirectTo({
      url: `../activite/activite?id=${this.data.activiteId}&isCopy=true`
    });
  },
  submitActivite(e) {
    var url = storage.getInsertUrl();
    let userInfo = this.data.userInfo;
    let that = this;

    wx.showLoading({
      title: '加入中...',
      mask: true
    });
    
    let filterStr = "$filter=PartitionKey%20eq%20'user'%20and%20activiteId%20eq%20'" + that.data.activiteId + "'and%20nickName%20eq%20'" + userInfo.nickName + "'";

    let urlgetuser = storage.getFilterUrl(filterStr);
    storage.queryData(filterStr,
      resp => {
        if (resp.data.value == undefined || resp.data.value.length == 0) {
          that.enrollActivite();
        }
      }
    );
  },
  enrollActivite() {
    // console.log('enroll');
    var url = storage.getInsertUrl();
    let userInfo = this.data.userInfo;
    let that = this;
    let data = {
      "PartitionKey": "user",
      "RowKey": Date.now().toString(),
      "nickName": userInfo.nickName,
      "avatarUrl": userInfo.avatarUrl,
      "gender": userInfo.gender,
      "activiteId": that.data.activiteId
    };

    storage.insertData(data,
      resp => {
        that.loadUserList(that.data.activiteId);
        wx.hideLoading();
      }
    );
  },
  quitActivite(e) {
    this.quitAct(this.data.userInfo.nickName);
  },
  openMap(e) {
    console.log(this.data.activiteLocation);
    wx.openLocation({
      name: this.data.activiteLocation.title,
      latitude: this.data.activiteLocation.location.lat,
      longitude: this.data.activiteLocation.location.lng,
      scale: 50,
    });
  },

  /*-------------------------------功能函数--------------------------------*/

  // message
  //------------------------------------------------------
  submitMessage(e) {
    // console.log(e.detail.value.message);
    // let msg = e.detail.value.message;
    if (this.data.message.trim() == '')
      return;
    let data = {
      "PartitionKey": "message",
      "RowKey": Date.now().toString(),
      "creator": this.data.userInfo.nickName,
      "activiteId": this.data.activiteId,
      "message": this.data.message
    };
    storage.insertConversation(data,
      resp => {
        // console.log('success add message');
        // console.log(resp);
        this.setData({
          message: ''
        });
      })
  },
  loadMessage(activiteId) {
    let that = this;
    that.setData({
      requesting: true
    });
    storage.getMessageByActiviteId(activiteId,
      resp => {
        //set the lastMessageRowKey separately for rendering the page
        let lastMsgRowKey = (resp.data.value == undefined || resp.data.value.length == 0) ? '' : resp.data.value[resp.data.value.length - 1].RowKey
        // let lastMsgRowKey = resp.data.value.length > 0 ? resp.data.value[resp.data.value.length - 1].RowKey : '';

        that.setData({
          messageList: resp.data.value,
          requesting: false,
          lastMessageRowKey: lastMsgRowKey,
        });
      },
      err => {
        clearInterval(messageLoader);
        let messageListErr = that.data.messageList;
        messageListErr.push({
          creator: 'System',
          message: '留言板连接已断开，请重新进入页面'
        });
        that.setData({
          messageList: messageListErr,
          requesting: false
        });
      }
    );
  },
  toggleMessageBoard(e) {
    let boardOpen = !this.data.openMessageBoard;
    this.setData({
      openMessageBoard: boardOpen,
      menuDisplay: !boardOpen
    });
  },
  inputMessage(e) {
    // console.log(e.detail.value);
    this.setData({
      message: e.detail.value
    });
  },
  focusMessage(e) {
    this.setData({
      messageEntering: true
    });
  },
  blurMessage(e) {
    console.log('blur');
    this.setData({
      messageEntering: false
    });
  },
  onShare(e) {
    wx.showShareMenu({
      withShareTicket: true,
      success: resp => { console.log(resp); }
    })
  },
  hideHelp(e) {
    console.log('hidehelp');
    this.setData({
      showHelp: false
    })
  },
  //teamup
  //--------------------------------------------
  teamUp(e) {
    let teamArray = new Array();
    this.data.userList.sort((a, b) => {
      return Math.random() > 0.5 ? -1 : 1;
    }).forEach((u) => {
      teamArray.push({
        avatarUrl: u.avatarUrl,
        nickName: u.nickName
      });
    });
    this.data.teamGroup = teamArray;
    // console.log(JSON.stringify(this.data.teamGroup));
    wx.setStorageSync("team", this.data.userList);
    wx.navigateTo({
      url: '../activiteTeam/activiteTeam?activiteId=' + this.data.activiteId
    });
  },
  toggleMenu(e) {
    this.setData({
      showMenu: !this.data.showMenu
    });
  },
  goToHome: function (e) {
    wx.navigateTo({
      url: '../activiteList/activiteList',
    })
  },
  //avatar - related
  kickOutClick:function(e){
    //return;//save for later
    let that = this;
    let tid = e.target.id;
    that.quitAct(tid);
    // that.kickout(tid);
  },
  toggleKickOut(e) {
    let that = this;
    that.setData({
      kickOutEnable: !that.data.kickOutEnable
    });
  },
})