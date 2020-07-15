// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    // 请求歌曲列表
    wx.cloud.callFunction({
      name: "music",
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then(res => {
      const pl = res.result[0].playListInfo
      this.setData({
        musiclist: pl.musicList,
        listInfo: {
          coverImgUrl: pl.uPic||"/image/kw.jpg",
          name: pl.name
        }
      })
      //储存本地，用于播放
      this._setStorage()
      wx.hideLoading()
    })

  },

  _setStorage(){
    wx.setStorageSync('musiclist', this.data.musiclist)
  },
  reset(e){
    let {listInfo}=this.data
    listInfo.coverImgUrl="/image/kw.jpg"
    this.setData({listInfo})
  }
})
