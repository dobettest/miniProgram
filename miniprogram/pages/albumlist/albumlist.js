// pages/singerlist/singerlist.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singerList: [],
    id: 146,
    prefix: '',
    category: "0",
    playlist:[],
    filterA: [{
        name: '伤感',
        id: '146'
      },
      {
        name: '放松',
        id: '42'
      },
      {
        name: '励志',
        id: '58'
      },
      {
        name: '治愈',
        id: '66'
      },
      {
        name: '思念',
        id: '160'
      },
      {
        name: '开心',
        id: '143'
      },
      {
        name: '甜蜜',
        id: '137'
      },
      {
        name: '寂寞',
        id: '147'
      }
    ],
    filterB: [{
        name: "校园",
        id: "382"
      },
      {
        name: "旅行",
        id: "375"
      },
      {
        name: "学习",
        id: "1876"
      }, {
        name: "工作",
        id: "386"
      },
      {
        name: "散步",
        id: "371"
      },
      {
        name: "跳舞",
        id: "378"
      },
      {
        name: "运动",
        id: "366"
      },
      {
        name: "清晨",
        id: "353"
      },
      {
        name: "睡前",
        id: "354"
      }
    ],
    filterC: [{
        name: "70s",
        id: "637"
      },
      {
        name: "80s",
        id: "638"
      },
      {
        name: "90s",
        id: "639"
      },
      {
        name: "00s",
        id: "640"
      },
      {
        name: "10s",
        id: "268"
      }
    ],
    active:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.initPage()
    let active="color:"+app.getSetting().themeColor
    this.setData({active})
    this.singerlist()
  },
  setid(e) {
    let {
      id
    } = e.currentTarget.dataset
    this.setData({
      id
    })
    this.singerlist()

  },
  singerlist() {
    wx.showLoading({
      title: '加载中',
    })
    let {
      id
    } = this.data
    wx.cloud.callFunction({
      name: "music",
      data: {
        $url: "albumlist",
        id
      }
    }).then(res => {
      console.log(res)
      let playlist= res.result.data.data
      this.setData({
        playlist
      })
    })
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})