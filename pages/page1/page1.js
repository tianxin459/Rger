
var dataUtil = require('../../utils/data.js')
var util = require('../../utils/util.js')

Page({
  data: {
    nameList: [],
    titleInput:false,
    title:''
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
  },
  inputTitle:function(e){
    console.log(e.detail.value);
    this.setData({
      title: e.detail.value,
      // titleInput: !!e.detail.value
      });
  },
  focusTitle: function (e) {
    this.setData({
      titleInput:true
    });
  },
  blurTitle: function (e) {
    this.setData({
      titleInput: !!e.detail.value
    });

  }
})