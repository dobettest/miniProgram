// pages/singer/singer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singer:{},
    options:{},
    musiclist:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.options=options
    this._getData()

  },
  _getData(){
    let {options}=this.data
    let id=options.singerId
    let pr1=new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name:'music',
        data:{
          $url:'getSinger',
          id
        },
        success:res=>{
          resolve(res.result.data)
        },
        fail:err=>{
          reject(err)
        }
      })
    })
    let pr2=new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name:'music',
        data:{
          $url:'getArtist',
          id
        },
        success:res=>{
          resolve(res.result.data)
        },
        fail:err=>{
          reject(err)
        }
      })
    })
    Promise.all([pr1,pr2]).then(res=>{
      wx.setStorageSync('musiclist',res[1].list)
      this.setData({singer:res[0],musiclist:res[1].list})
      console.log(res)
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

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