// pages/player/player.js
//歌单存储数组
let musiclist =[]
//识别点击哪首歌
let nowPlayingIndex = -1
let complete=false
//播放音乐全局唯一背景音频管理器
let backgroundAudioManager = wx.getBackgroundAudioManager()
const app=getApp()
let current=app.getCurrent()
let setting=app.getSetting()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: "",
    circlemode:0,
    mode:["iconshunxu","iconcircleone","iconcirclelist","iconrandom"],
    //控制播放暂停
    isPlaying: false,
    isLyricShow: false,

    // 歌词信息
    lyric: "",
    //表示是否为同一首歌
    isSame: false,
  },
  init(){
    let {circlemode}=setting
    this.setData({circlemode})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init()
    musiclist=wx.getStorageSync('musiclist')||[]
    let {rid}=app.getCurrent()
    let musicid = options.musicid||rid||musiclist[0].rid
    nowPlayingIndex=musiclist.findIndex(v=>v.rid==musicid)
    nowPlayingIndex=nowPlayingIndex!=-1?nowPlayingIndex:0
    this._loadMusicDetail(musicid)
  },

  // 请求歌曲播放的url，point类似musicid
  _loadMusicDetail(point) {
    if (point==app.getCurrent().rid){
      console.log("same")
      this.setData({
        isSame: true
      })
      console.log("same")
      // backgroundAudioManager.play()
    } else {
      backgroundAudioManager.stop()
    }
    let music = musiclist[nowPlayingIndex]
    wx.setNavigationBarTitle({
      title: music.name
    })
    this.setData({
      picUrl: music.albumpic
    })
    wx.cloud.callFunction({
      name: "music",
      data: {
        $url: 'musicUrl',
        musicid:point
      }
    }).then(res => {
      const result = JSON.parse(res.result)
      //设置权限
      if (result.url == null) {
        wx.showToast({
          title: '无权限播放',
        })
        return
      }
      if (!this.data.isSame) { //不是同一首
        //获得新歌曲各种基础信息，URL
        backgroundAudioManager.src = result.url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.albumpic
        backgroundAudioManager.singer = music.artist
        backgroundAudioManager.epname = music.album
        music.url=result.url
        complete=false
        // 保存播放历史
        this.savePlayHistory()
      }
      else{
        let {url,name,currentTime,duration}=app.getCurrent()
            backgroundAudioManager.title=name
            backgroundAudioManager.src=url
            music.url=url
            if(app.globalData.hasinit==false){
            backgroundAudioManager.seek(currentTime)
            app.globalData.hasinit=true
            }
            backgroundAudioManager.currentTime=currentTime
      }
      this.setData({
        isPlaying: true,
        isSame:false
      })
      app.setCurrent(music)
      wx.setStorageSync('current',music)
      app.setisplaying(true)
      this.getLyric(point)
      //请求歌词信息
    })
  },
  getLyric(point){
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'lyric',
        musicid:point
      }
    }).then(res => {
      let lyric = '暂无歌词'
      let data = JSON.parse(res.result)
      // if (lrc) {
      //   lyric = lrc.lyric
      // }
      if(!data.data['lrclist'])
      data.data['lrclist']=['未找到歌词']
      this.setData({
        lyric:data.data['lrclist']
      })
    })
  },
  // 播放、暂停按钮 
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    let isPlaying=!this.data.isPlaying
    this.setData({
      isPlaying
    })
    app.setisplaying(isPlaying)
  },
  onPrev() {
    this.readmode('pre')
  },
  onNext() {
    this.readmode('next')
  },

  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  //父组件为中介，歌词、进度联动
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
    current=app.getCurrent()
    current['currentTime']=event.detail.currentTime
    wx.setStorageSync('current',current)
  },
  //面板链接组件联动
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },
  onPause() {
    this.setData({
      isPlaying: false
    })
  },
  // 保存播放历史
  savePlayHistory() {
    //  当前正在播放的歌曲
    const music = musiclist[nowPlayingIndex]
    let openid=app.globalData.openid
    let historyList=wx.getStorageSync(openid)||[]
    historyList.unshift(music)
    wx.setStorageSync(openid,historyList)
  },
  handlemode(e){
    let {circlemode,mode}=this.data
    circlemode=circlemode<mode.length-1?++circlemode:0
    let setting=app.getSetting()
    this.setData({circlemode})
    setting.circlemode=circlemode
    app.setSetting('circlemode',circlemode)
    wx.setStorageSync('setting',setting)
  },
  readmode(mode){
    complete=true
    let count=mode=='pre'?-1:1
    let {circlemode,isPlaying}=this.data
    switch(circlemode){
      case 0:
        nowPlayingIndex<musiclist.length-1?nowPlayingIndex+=count:isPlaying=false
        this.setData({isPlaying})
        break;
      case 1:
        break;
      case 2:
        nowPlayingIndex=nowPlayingIndex<musiclist.length-1?nowPlayingIndex+count:0
        break;
      case 3:
          nowPlayingIndex=parseInt(Math.random()*musiclist.length)
          break;

    }
    this.data.lyric=""
    app.setCurrent({})
    this._loadMusicDetail(musiclist[nowPlayingIndex].rid)
  }

})