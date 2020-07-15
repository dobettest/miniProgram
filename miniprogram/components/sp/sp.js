// components/swiper/swiper.js
let timer=null
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    arr:{
      type:Array,
      value:[]
    },
    t:{
      type:Number,
      value:3000
    }

  },
  pageLifetimes:{
    show(){
      this.change()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current:-1,
    ishover:false

  },

  /**
   * 组件的方法列表
   */
  methods: {
    change(){
      // let {ishover,current,arr,t}=this.data
      // if(ishover==false)
      // timer=setInterval(()=>{
      //   current=current<arr.length-1?++current:0
      //   this.setData({current})
      // },t/2)
    }

  }
})
