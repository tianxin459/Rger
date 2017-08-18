
var dataUtil = require('../../utils/data.js')
var util = require('../../utils/util.js')

Page({
  data: {
    nameList: []
  },
  onLoad: function (options) {
    console.log('list load');
    this.setData({
      nameList: dataUtil.userList
    });
    // console.log(this.getData());
  },
  Sort: function () {
    this.setData({
      nameList: this.data.nameList.sort(util.randomSort)
    });
    console.log(JSON.stringify(this.data.nameList, null, 2));
  }
})