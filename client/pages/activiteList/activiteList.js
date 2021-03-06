// pages/activiteList/activiteList.js
var app = getApp();
var storage = require('../../utils/storage.js');
var util = require('../../utils/util.js');
var lang = require('../../i18n/lang.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lang: lang[app.globalData.lang],
    btnLangText: app.globalData.langSet[app.globalData.langSetIndex],

    dateNow: util.formatTime(new Date()).replace(/\d{2}:\d{2}:\d{2}/, '').trim(),
    activites: [],
    activitesPast: [],
    userInfo: {},
    // onLoad: true,
    loading: true,
    msg: '',
    showHistory: false,
    showMenu: false,
  },
  switchLang(e) {
    app.globalData.langSetIndex = (app.globalData.langSetIndex + 1) % 2;
    app.globalData.lang = app.globalData.langSet[app.globalData.langSetIndex];
    this.setData({
      lang: lang[app.globalData.lang]
    })
  },
  onShow: function (options) {

    let that = this;
    // throw 'error testing';
    app.getUserInfo(function (u) {
      that.setData({
        userInfo: u
      });
      that.loadList();
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date();
    console.log(date.getFullYear(),date.getMonth(),date.getDate());

    this.setData({
      lang: lang[app.globalData.lang]
    });

    console.log(app.globalData.userInfo);
    let that = this;
    // throw 'error testing';
    app.getUserInfo(function (u) {
      that.setData({
        userInfo: u
      });
    });

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadList();
    let that = this;
    app.getUserInfo(function (u) {
      // console.log(u);
      that.setData({
        userInfo: u
      });
    });
  },
  loadList() {
    let url = storage.getAllListUrl('2018-05-01');
    let that = this;
    wx.request({
      method: "GET",
      url: url,
      header: {
        Accept: 'application/json'
      },
      success: resp => {
        let jstr = JSON.stringify([{ name: "12" }]);
        let jobj = JSON.parse(jstr);
        // console.log(resp.data);
        let actList = resp.data.value.sort((a, b) => {
          return (a.date + a.time > b.date + b.time) ? 1 : -1;
        });

        storage.getActiviteUser(
          resp => {
            // console.log(resp.data.value);
            for (let au of resp.data.value) {
              for (let a of actList) {
                if (au.activiteId == a.RowKey) {
                  a.userNumber = au.userNumber;
                }
              }
            }

            let actCurrent = new Array();
            let actPast = new Array();
            for (let au of actList) {
              //console.log(au.Creator);
              if (au.date < that.data.dateNow) {
                if (au.Creator == this.data.userInfo.nickName
                  || this.data.userInfo.nickName == app.globalData.admin)
                  {actPast.push(au);}
              }
              else {
                actCurrent.push(au);
              }
            }

            //order the history list
            actPast = actPast.sort((a,b)=>{
              if (a.date > b.date) return -1;
              else if (a.date < b.date) return 1;
              else return 0;
            });
            console.log('loading complete');
            that.setData({
              activites: actCurrent,
              activitesPast: actPast,
              loading: false
            });
          }
        );
      },
      complete: () => {
      }
    });
  },
  join(e) {
    wx.navigateTo({
      url: '../activiteDetail/activiteDetail?id=' + e.currentTarget.dataset.id
    })
  },
  addActivite() {
    wx.navigateTo({
      url: '../activite/activite'
    })
  },
  showup() {
    return 'dasdf';
  },
  toggleHistory(e) {
    this.setData({
      showHistory: !this.data.showHistory
    })
  },
  toggleMenu(e) {
    console.log('menu tab');
    this.setData({
      showMenu: !this.data.showMenu
    });
  },
})