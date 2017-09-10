// pages/activite/activite.js
var app = getApp();
var storage = require('../../utils/storage.js');
var place = require('../../utils/place.js');
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */

  activiteId: '',
  data: {
    isAdminDate: false,
    isCopy: false,
    loading: true,
    activiteId: '',
    title: '',
    content: '',
    date: '',
    time: '',
    duration: 0,
    titleFlag: true,
    dateFlag: true,
    timeFlag: true,
    durationFlag: true,
    location: {},
    locationName: '',
    userInfo: {},
    inputVal: "",
    inputShowed: false,
    isUpdateFlag: false,
    activite: {},
    titleInput: false,
    contentInput: false,
    dayOfWeek: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.isCopy = !!options.isCopy;
    let that = this;
    //if id exists then in update status
    if (!!options.id) {
      let filterStr = "$filter=RowKey%20eq%20'" + options.id + "'";
      storage.queryData(filterStr,
        resp => {
          console.log(resp.data.value[0]);
          let a = resp.data.value[0];
          // let dateNow = util.formatTime(new Date()).replace(/\d{2}:\d{2}:\d{2}/, '').trim();
          if (that.data.isCopy && !!a.date) {
            let nearestDate = new Date(a.date);
            let dateNow = new Date();
            while (nearestDate < dateNow) {
              nearestDate.setDate(nearestDate.getDate() + 7);
            }
            // console.log(nearestDate);
            // console(util.weekDay[nearestDate.getDay()]);
            a.date = util.formatTime(nearestDate).replace(/\d{2}:\d{2}:\d{2}/, '').trim();
            console.log(a.date);
          }


          let day = (new Date(a.date)).getDay();
          let loc = JSON.parse(a.location || '{}');
          if (a === undefined)
            return;
          that.setData({
            title: a.title,
            content: a.content,
            time: a.time,
            date: a.date,
            duration: a.duration,
            locationName: loc.title,
            location: loc,
            activite: a,
            isUpdateFlag: true,
            id: options.id,
            loading: false,
            dayOfWeek: util.weekDay[day],
            titleInput: !!a.title,
            contentInput: !!a.content,
          });
        });
    }
    app.getUserInfo(userInfo => {
      that.setData({
        userInfo: userInfo
      })
    },
      e => {
        console.error(e);
      });
  },
  onShow: function (options) {

  },
  onSubmit() {
    var url = storage.getInsertUrl();
    // console.log(this.data.title);
  },
  deleteActivite(e) {
    wx.showLoading({
      title: '删除活动...',
      mask: true
    });
    let activiteId = this.data.activite.RowKey;
    // delete all related participator
    storage.loadUserList(activiteId,
      resp => {
        for (let i of resp.data.value) {
          storage.deleteData("user", i.RowKey,
            resp => {
              console.log('user ' + i.RowKey + ' deleted');
            });
        }
        storage.deleteData("activite", activiteId,
          resp => {
            wx.hideLoading();
            wx.showModal({
              content: '活动已删除',
              showCancel: false,
              success: function (res) {
                wx.navigateTo({
                  url: '../activiteList/activiteList'
                })
              }
            });
          });
      });


  },
  submitActivite(e) {
    if (!this.data.title) {
      this.setData({
        titleFlag: false
      });
      wx.showModal({
        title: '保存失败',
        content: '请输入标题',
        showCancel: false
      });
      return;
    }

    wx.showLoading({
      title: '保存中...',
      mask: true
    });
    let title = this.data.title;
    let content = this.data.content;
    let duration = this.data.duration;
    var url = storage.getInsertUrl();
    // console.log(url);
    let rowKey = this.data.isUpdateFlag ? this.data.activite.RowKey : Date.now().toString();
    let rowKeyTemp = rowKey;
    rowKey = this.data.isCopy ? Date.now().toString() : rowKey;
    console.log(`isCopy=${this.data.isCopy},rowKey=${rowKey}/${rowKeyTemp}`);
    let isAdminFlag = app.globalData.admin == this.data.userInfo.nickName;
    console.log('isAdminFlag=' + isAdminFlag)
    let creatorName = (isAdminFlag && this.data.isUpdateFlag) ? this.data.activite.Creator : this.data.userInfo.nickName;
    this.data.activiteId = rowKey;
    let data = {
      "title": title,
      "content": content,
      "PartitionKey": "activite",
      "Creator": creatorName,
      "date": this.data.date,
      "time": this.data.time,
      "duration": duration,
      "location": JSON.stringify(this.data.location),
      "RowKey": rowKey
    };
    let cb_success = resp => {
      // console.log(resp.data.value);
      wx.hideLoading();
      this.openAlert();
    };
    let cb_failure = e => {
      wx.hideLoading();
      console.log(e);
    };
    //check if is update
    if (this.data.isUpdateFlag) {
      storage.updateData("activite",
        rowKey,
        data,
        cb_success,
        cb_failure);
    }
    else {
      storage.insertData(data,
        cb_success,
        cb_failure);
    }
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    });
  },
  bindDateChange(e) {
    let day = (new Date(e.detail.value)).getDay();
    this.setData({
      date: e.detail.value,
      dayOfWeek: util.weekDay[day]
    });
  },
  openAlert() {
    // this.setData({
    //   startGuide: true
    // });
    let that = this;
    wx.showModal({
      content: '保存成功',
      confirmText: '分享页面',
      cancelText: '返回主页',
      // showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../activiteDetail/activiteDetail?id=' + that.data.activiteId,
          });
        }
        else {
          wx.redirectTo({
            url: '../activiteList/activiteList'
          });
        }
      }
    });
  },

  //input 
  //-------------------------------
  inputTitle: function (e) {
    this.setData({
      title: e.detail.value,
      // titleInput: !!e.detail.value
    });
  },
  focusTitle: function (e) {
    this.setData({
      titleInput: true
    });
  },
  blurTitle: function (e) {
    this.setData({
      titleInput: !!e.detail.value
    });
  },
  inputContent(e) {
    this.setData({
      content: e.detail.value
    });
  },
  focusContent: function (e) {
    this.setData({
      contentInput: true
    });
  },
  blurContent: function (e) {
    this.setData({
      content: e.detail.value,
      contentInput: !!e.detail.value
    });
  },
  inputDuration(e) {
    this.setData({
      duration: e.detail.value
    });
  },
  inputTyping: function (e) {
    this.setData({
      locationName: e.detail.value
    });
  },

  //--------------------------------
  openSheet() {
    if (!this.data.locationName)
      return;
    let that = this;
    wx.showLoading({
      title: '查询中...',
      mask: true
    });
    place.searchPlace(this.data.locationName,
      null,
      resp => {
        console.log('loading complete');
        wx.hideLoading();
        if (!!resp.data&&!!resp.data.data&&resp.data.data.length == 0) {
          wx.showModal({
            content: '无搜索结果',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.hideInput();
                return;
              }
            }
          });
        }
        else {
          let locations = new Array();
          for (let i of resp.data.data) {
            locations.push(i.title + '(' + i.address + ')');
          }
          wx.showActionSheet({
            itemList: locations,
            success: function (res) {
              if (!res.cancel) {
                that.setData({
                  location: resp.data.data[res.tapIndex]
                });
                that.hideInput();
              }
            }
          });
        }
      }
    );
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  //guide
  //------------------------------------------------------
  onGuide(e) {
    console.log('startGuide');
    this.setData({
      startGuide: true
    });
  },

  //validateion

})