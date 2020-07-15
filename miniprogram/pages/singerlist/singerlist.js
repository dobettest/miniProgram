// pages/singerlist/singerlist.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singerList:[],
    prefix:'',
    category:"0",
    active:"",
    filterA:[
      {
        name:'热门',
        value:''
      }
    ],
    filterB:[
      {
        name:"全部",
        value:"0"
      },
      {
        name:"华语男",
        value:"1"
      },
      {
        name:"华语女",
        value:"2"
      },{
        name:"华语组合",
        value:"3"
      },
      {
        name:"日韩男",
        value:"4"
      },
      {
        name:"日韩女",
        value:"5"
      },
      {
        name:"日韩组合",
        value:"6"
      },
      {
        name:"其他",
        value:"10"
      },
      {
        name:"欧美男",
        value:"7"
      },
      {
        name:"欧美女",
        value:"8"
      },
      {
        name:"欧美组合",
        value:"9"
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.initPage()
    this.singerlist()
    this.genFilterA()
  },
  genFilterA(){
    let active="color:"+app.getSetting().themeColor
    let {filterA}=this.data
    let s="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for(let i of s)
    {
      let obj={
        name:i,
        value:i
      }
      filterA.push(obj)
    }
    filterA.push({
      name:'#',
      value:'%2523'
    })
    this.setData({filterA,active})
  },
  seta(e){
    let {prefix}=e.currentTarget.dataset
    this.setData({prefix})
    this.singerlist()

  },
  setb(e){
    let {category}=e.currentTarget.dataset
    this.setData({category})
    this.singerlist()
  },
  singerlist(){
    let {prefix,category}=this.data
    wx.cloud.callFunction({
      name:"music",
      data:{
        $url:"singerlist",
        prefix,
        category
      }
    }).then(res=>{
      let {artistList}=res.result.data
      let singerList=artistList.filter((v,i)=>i<9)
      this.setData({singerList})
    })
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