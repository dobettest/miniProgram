// components/bang/bang.js
var app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bang:{
      type:Object
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    init:false

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event) {
      let {bang}=this.data
      if(this.data.init==false)
      {
        wx.setStorageSync('musiclist',this.data.bang.musicList)
        this.data.init=true
      }
      const e = event.currentTarget.dataset
      const musicid = e.musicid
      this.setData({
        playid: musicid
      })
      // let current=bang.musicList[bang.musicList.findIndex(v=>v.rid==musicid)]
      // app.setCurrent(current)
      wx.navigateTo({
        url: `/pages/player/player?musicid=${musicid}`,
      })
    }
  }
})
