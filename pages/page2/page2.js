
var dataUtil = require('../../utils/data.js')
var util = require('../../utils/util.js')

var app = getApp()

Page({
  data: {
    nameList: [],
    userInfo: {},
    hideBtnQuit: false,
    assignedClass: '',
  },
  onLoad: function (options) {
    // console.log();
    this.setData({
      nameList: dataUtil.userList,
      userInfo: app.getUserInfo()
    });
  },
  Sort: function () {
    this.data.nameList.map(function (value, index, array) {
      value.assigned = true;
    });
    this.setData({
      nameList: this.data.nameList.sort(util.randomSort),
      assignedClass: '-assigned'
    });
    console.log(JSON.stringify(this.data.nameList, null, 2));
  },
  Quit: function () {
    let i = 0;
    for (i in this.data.nameList) {
      if (this.data.nameList[i].name == this.data.userInfo.nickName) {
        if (this.data.nameList[i].assigned) {
          this.data.nameList[i] = {};
        }
        else {
          this.data.nameList.splice(i, 1);
        }
        this.setData({
          nameList: this.data.nameList,
          hideBtnQuit: true
        });
        break;
      }
    }
  }
})