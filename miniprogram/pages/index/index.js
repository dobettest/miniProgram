const db = wx.cloud.database()
const MAX_LIMIT = 15
Page({
  data: {
    imgurl: [],
    playlist: [],
    playlistTag:[],
    banners:[],
    banglist:[],
    singerlistTag:[{name:'华语',value:11,isActive:true},{name:'欧美',value:'13',isActive:false},{name:'日韩',value:'12',isActive:false},{name:'组合',value:'16',isActive:false}],
    singerList:[
      {
        id:336,
        musicNum:1136,
        name:'周杰伦',
        pic:'https://img1.kuwo.cn/star/starheads/300/10/6/294045140.jpg'
      },
      {
        id:3493057,
        musicNum:96,
        name:'阿悠悠',
        pic:'https://img2.kuwo.cn/star/starheads/300/82/59/2918311927.jpg'
      },
      {
        id:5371,
        musicNum:829,
        name:'邓紫棋',
        pic:'https://img4.kuwo.cn/star/starheads/300/1/27/2191880246.jpg'
      }
    ],
    current:0
  },

  onLoad: function(options) {
    this._getData()
  },
  _getData() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: "music",
      data: {
        $url: 'getData'
      }
    }).then(res => {
      let { playlistTag, banners,playlist,bang} =res.result[0]
      playlistTag.forEach(v=>{
        v.isActive=v.name=="每日推荐"?true:false
      })
      this.setData({
        playlistTag,
        banners,
        playlist:playlist.list.filter((v,i)=>i<6),
        banglist:bang.filter((v,i)=>i<3)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  onReachBottom: function() {
    // this._getplaylist()
  },
  onPullDownRefresh: function() {
    this._getData()
  },
  handleItemChange(e){
    let {id}=e.detail
    let {playlistTag}=this.data
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:"getTagPlayList",
        id
      }
    }).then(res=>{
      playlistTag.forEach(v=>{v.isActive=v.id==id?true:false})
      console.log(res)
      let result=res.result.data.data||res.result.data.list
      let playlist=result.filter((v,i)=>i<6)
      this.setData({playlist,playlistTag})
    })
    // this.setData({current:index})

  },
  search(e){
    let {data}=e.detail
    if(data.length==0)
    return;
    wx.navigateTo({
      url: '/pages/search/search?data='+data,
    })
  },
  parseUrl(url){
    return url.split("/").pop()
  },
  playDetail(e){
    let id=this.parseUrl(e.currentTarget.dataset.item.url)
    if(!isNaN(id))
    wx.navigateTo({
      url: '/pages/musiclist/musiclist?playlistId='+id,
    })
  },
  singerlist(e){
    wx.navigateTo({
      url: '/pages/singerlist/singerlist'
    })
  },
  albumlist(){
    wx.navigateTo({
      url: '/pages/albumlist/albumlist',
    })
  },
  handleSinger(e){
    let {id}=e.detail
    let {singerlistTag}=this.data
    singerlistTag.forEach(v=>v.isActive=v.value==id?true:false)
    wx.cloud.callFunction({
      name:"music",
      data:{
        $url:"singerlist",
        prefix:'',
        category:id
      }
    }).then(res=>{
      let {artistList}=res.result.data
      let singerList=artistList.filter((v,i)=>i<3)
      this.setData({singerList,singerlistTag})
    })

  }

 


})