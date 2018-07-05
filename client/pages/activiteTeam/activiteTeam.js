// pages/activiteTeam/activiteTeam.js
var app = getApp();
var storage = require('../../utils/storage.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    userList: [],
    activiteId: '',
    teamInfo: [],
    openParticipator:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let userList = wx.getStorageSync("team");
    this.data.activiteId = options.activiteId ||'1502762517921';
    wx.setStorage({
      key: 'team',
      data: '',
    })
    console.log('activiteId='+options.activiteId);
    storage.getTeamInfo(this.data.activiteId,
      resp => {

        let teamInfo = resp.data.value[0] || {};
        that.setData({
          loading: false,
          userList: userList,
          teamInfo: JSON.parse(teamInfo.teamInfo || '{}'),
          openParticipator: !teamInfo.teamInfo,
        });
      });
  },

  teamUp(e) {
    let teamArray = new Array();
    let teamNo = 1;
    let teamSize = 2;
    let teamIdle = new Array();
    this.data.userList.sort((a, b) => {
      return Math.random() > 0.5 ? -1 : 1;
    }).forEach((u) => {

      teamIdle.push({
        avatarUrl: u.avatarUrl,
        nickName: u.nickName,
        gender: u.gender,
        teamNo: Math.ceil(teamNo / 2)
      });

      if (teamNo%teamSize == 0) {
        teamArray.push(teamIdle);
        teamIdle = new Array();
      }

      teamNo++;
    });
    this.setData({
      teamInfo: { teamIdle,teamArray}
    });
    console.log(this.data.teamInfo);
  },
  saveTeamInfo(e) {
    storage.updateTeamInfo(
      this.data.activiteId,
      this.data.teamInfo,
      resp => {
        console.log(resp)
      });
  },
  toggleParticipator(e){
    this.setData({
      openParticipator:!this.data.openParticipator
    });
  }
})