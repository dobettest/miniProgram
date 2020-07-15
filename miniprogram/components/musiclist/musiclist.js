// components/musiclist/musiclist.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playid: -1
  },
  //组件的page生命周期函数
  pageLifetimes: {
    show:function() {
      app.initPage()
      this.setData({
        playid: parseInt(app.getCurrent().rid)
      })

    }
  },
 
  methods: {
    onSelect(event) {
      let {musiclist}=this.data
      const e = event.currentTarget.dataset
      const musicid = e.musicid
      this.setData({
        playid: musicid
      })
    //  let current=musiclist[musiclist.findIndex(v=>v.rid==musicid)]
    //  app.setCurrent(current)
      wx.navigateTo({
        url: `/pages/player/player?musicid=${musicid}`,
      })
    }
  }
})