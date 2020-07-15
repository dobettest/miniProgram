//app.js
App({
  onLaunch: function() {
    this.checkUpate()
    wx.cloud.init({
      env: "test-t8bel",
      traceUser: true
    })
   let setting=wx.getStorageSync('setting')||{circlemode:0,themeColor:'#52D496'}
   let current=wx.getStorageSync('current')||{albumpic:"/image/kw.jpg"}
   wx.setNavigationBarColor({backgroundColor:setting.themeColor,frontColor:'#ffffff'})
    this.getOpenid()
    this.globalData = {
      setting,
      openid: -1,
      tab:0,
      current,
      hasinit:false,
      isplaying:false,
    }
  },
  initPage(){
    let setting=this.globalData.setting
    wx.setNavigationBarColor({backgroundColor:setting.themeColor,frontColor:'#ffffff'})
  },
  setCurrent(music){
    this.globalData.current=music
  },
  getCurrent(){
    return this.globalData.current
  },
  setisplaying(isplaying){
    this.globalData.isplaying=isplaying
  },
  getisplaying() {
    return this.globalData.isplaying
  },
  getSetting(){
    return this.globalData.setting;
  },
  setSetting(key,value){
    this.globalData.setting[key]=value
  },
  tab(index){
    if(index==undefined)
    return this.globalData.tab
    else
    this.globalData.tab=index
  },
  //获取openID
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then((res) => {
      const openid = res.result.openid
      this.globalData.openid = openid
    })
  },
  last(){
    this.globalData.setting=wx.getStorageSync('setting')
  },

  //小程序更新机制
  checkUpate() {
    const updateManager = wx.getUpdateManager()
    // onCheckForUpdate事件检测版本更新,事件处理函数里完成更新
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        //坚挺是否成功
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
  },
})