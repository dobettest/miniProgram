// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const TcbRouter = require('tcb-router');

var rp = require('request-promise');

// 因版权问题，就不上传真接口了，如有需要可以访问网易云开源api网站
const BASE_URL = 'https://v1.hitokoto.cn/nm'

// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  });
  app.router('playlist', async(ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc').get().then(res => {
        return res
      })
  })

  app.router('musiclist', async (ctx, next) => {
    ctx.body = await rp("https://www.dobettest.cn:8000/kuwo/getData?url=playlist_detail/"+parseInt(event.playlistId)+"&pos=8")
      .then(res=>{
        return JSON.parse(res)
      })
  })
  app.router('getData', async (ctx, next) => {
    ctx.body = await rp("https://www.dobettest.cn:8000/kuwo/getData")
      .then(res => {
       return JSON.parse(res)
      })
  })
  app.router('musicUrl', async (ctx, next) => {
    ctx.body = await rp("https://www.dobettest.cn:8000/kuwo/getMusic?rid=" + event.musicid)
      .then(res => {
        return res
      })
  })

  app.router('lyric', async (ctx, next) => {
    ctx.body = await rp("https://www.dobettest.cn:8000/kuwo/getMusicRc?id=" + event.musicid)
      .then(res => {
        return res
      })
  })
  app.router('getSinger', async (ctx, next) => {
    ctx.body = await rp("https://www.dobettest.cn:8000/kuwo/getSinger?id=" + event.id)
      .then(res => {
        return JSON.parse(res)
      })
  }),
  app.router('getArtist', async (ctx, next) => {
    ctx.body = await rp("https://www.dobettest.cn:8000/kuwo/getArtist?id=" + event.id)
      .then(res => {
        return JSON.parse(res)
      })
  }),
  app.router('getTagPlayList', async (ctx, next) => {
    ctx.body = await rp('https://www.dobettest.cn:8000/kuwo/getAlbum/?id='+event.id)
      .then(res => {
        return JSON.parse(res)
      })
  })
  app.router('searchList', async (ctx, next) => {
    ctx.body = await rp('https://www.dobettest.cn:8000/kuwo/searchList?key='+event.key)
      .then(res => {
        return JSON.parse(res)
      })
  })
  app.router('singerlist', async (ctx, next) => {
    ctx.body = await rp('https://www.dobettest.cn:8000/kuwo/singerlist?prefix='+event.prefix+'&category='+event.category)
      .then(res => {
        return JSON.parse(res)
      })
  })
  app.router('albumlist', async (ctx, next) => {
    ctx.body = await rp('http://www.kuwo.cn/api/pc/classify/playlist/getTagPlayList?pn=1&rn=9&id='+event.id)
      .then(res => {
        return JSON.parse(res)
      })
  })

  return app.serve()
}
