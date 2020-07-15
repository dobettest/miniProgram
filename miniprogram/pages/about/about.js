//about.js
//获取应用实例
var app = getApp();
Page({
  data: {
    showLog: false
  },
  onLoad: function(){
    app.initPage()

  },
  toggleLog: function(){
    this.setData({
      showLog: !this.data.showLog
    });
  }
});