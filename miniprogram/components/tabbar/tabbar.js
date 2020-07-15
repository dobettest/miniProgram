// components/tabbar/tabbar.js
const app= getApp();
let bga=wx.getBackgroundAudioManager()
let currentTime=0
let duration=0
let complete=false
let musiclist=[]
let nowPlayingIndex=0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    current:{
      type:Number,
      value:0,
    },
    tabList: {
      type: Array,
      value: [
        {
          pagePath: "/pages/index/index",
          text: "发现",
          iconPath: "iconshouye",
        },
        {
          pagePath: "/pages/player/player",
          iconPath: "/image/found.png",
        },
        {
          pagePath: "/pages/profile/profile",
          text: "我的",
          iconPath: "iconwode",
        }
      ]
    }
  },
  pageLifetimes:{
    show:function(){
      app.initPage()
      musiclist=wx.getStorageSync('musiclist')||[]
      this.initbga()
      let {current,active,circlemode,isPlaying,currentPic}=this.data
      currentPic=app.getCurrent().albumpic
      isPlaying=app.getisplaying()
      circlemode=app.getSetting().circlemode
      current=app.tab()
      let setting=app.getSetting()
      active="color:"+setting.themeColor
      this.setData({current,active,circlemode,isPlaying,currentPic})
      this.updateProgress() 
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    currentPic:'/image/kw.jpg',
    isPlaying:false,
    active:'',
    percent:0,
    circlemode:0,
    isSame:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initbga(){
      let {currentTime,duration,rid}=app.getCurrent()
      console.log(app.getCurrent())
      let percent=currentTime/duration
      nowPlayingIndex=musiclist.findIndex(v=>v.rid==rid)
      this.setData({percent})
    },
    readmode(mode){
      console.log("readmode")
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
      this._loadMusicDetail(musiclist[nowPlayingIndex].rid)
    },
      _loadMusicDetail(point) {
        if (point==app.getCurrent().rid){
          console.log("same")
          this.setData({
            isSame: true
          })
          console.log("same")
          // bga.play()
        } else {
          bga.stop()
        }
        let music = musiclist[nowPlayingIndex]
        this.setData({
          currentPic: music.albumpic
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
            bga.src = result.url
            bga.title = music.name
            bga.coverImgUrl = music.albumpic
            bga.singer = music.artist
            bga.epname = music.album
            music.url=result.url
            complete=false
            // 保存播放历史
          }
          else{
            let {url,name,currentTime,duration}=app.getCurrent()
                bga.title=name
                bga.src=url
                music.url=url
                if(app.globalData.hasinit==false){
                bga.seek(currentTime)
                app.globalData.hasinit=true
                }
                bga.currentTime=currentTime
          }
          this.setData({
            isPlaying: true,
            isSame:false
          })
          app.setCurrent(music)
          wx.setStorageSync('current',music)
          app.setisplaying(true)
          //请求歌词信息
        })
    },
    updateProgress(){
      bga.onTimeUpdate(()=>{
        let {percent}=this.data
        currentTime=bga.currentTime
        duration=bga.duration
        percent=currentTime / duration
        this.setData({percent})
        // let c=app.getCurrent()
        // c['currentTime']=currentTime
        // wx.setStorageSync('current',c)
      })
      bga.onEnded(()=>{
        this.readmode("next")
      })
    },
    handleItemChange(e){
      let {index}=e.currentTarget.dataset
      let {tabList}=this.data
      index=parseInt(index)
      if(index!=1)
      app.tab(index)
      let url=tabList[index].pagePath
      index==1?wx.navigateTo({
        url
      }):
      wx.switchTab({
        url
      });
      // this.triggerEvent('itemChange',{index})
    }
  }
})
