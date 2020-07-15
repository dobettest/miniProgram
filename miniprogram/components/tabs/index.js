
/**
 * index
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    },
    More:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChange(e)
    {
      let {id}=e.currentTarget.dataset;
      this.triggerEvent("handleChange",{id})

    },
    more(e){
      this.triggerEvent("handlemore")
    }

  }
})

