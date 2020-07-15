// components/progress-circle/progress-circle.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    radius:{
      type:Number,
      value:100
    },
    percent:{
      type:Number,
      value:0
    },
    dashOffset:{
      type:Number,
      value:0
    }

  },
  observers:{
    ['percent'](percent) {
      let {dashOffset,dashArray}=this.data
      dashOffset=(1 -percent) * dashArray
      this.setData({dashOffset})      
    },
    ['radius'](radius){
      let {svg}=this.data
      svg=`'data:image/svg+xml, %3Csvg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" width="${radius}" height="${radius}"%3E%3C/svg%3E'`
      this.setData({svg})

    },
    ['dashOffset'](dashOffset){
    let {c2,dashArray}=this.data
    c2=`'data:image/svg+xml, %3Csvg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle r="45" cx="50" cy="50" fill="transparent" stroke-width="8px" stroke="rgba(82,212,150,0.5)" stroke-dasharray="${dashArray}" stroke-dashoffset="${dashOffset}"/%3E%3C/svg%3E'`
      this.setData({c2})
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dashArray:Math.PI*90,
    themeColor:"",
    c:`'data:image/svg+xml, %3Csvg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle r="45" cx="50" cy="50" fill="transparent" stroke="rgba(255, 205, 49, 0.5)" stroke-width="8px"/%3E%3C/svg%3E'`,
    c2:"",
    svg:""
  },
  created:function(){
    let themeColor=app.getSetting().themeColor
    this.setData({themeColor})
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
