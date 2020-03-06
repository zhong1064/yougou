// pages/goods_detail/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
     // 商品详情数据
     detail:{},
     current:0,
     //图片数据改造
     urls:[]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
      //请求商品详情 
      request({
        url:'/goods/detail',
        data:{
          goods_id: options.keyword
        }
      }).then(res => {    
         const {message} = res.data
         const urls = message.pics.map( v => {
           return v.pics_big
         })
         this.setData({
           detail:message,
           urls
         })
      })
  },
 //tab栏切换 
  handleTab(e){
     const {index} = e.target.dataset 
     this.setData({
       current:index
     })
  },
  handleImg(e){
   
    const {imgindex} = e.target.dataset
    //点击图片先大图
    wx.previewImage({
      current: this.data.urls[imgindex],// 当前显示图片的http链接
      urls: this.data.urls // 需要预览的图片http链接列表
    })
  },
  // 点击加入购物车,跳转购物车页
  handleCart(){
    wx.switchTab({
      url: '/pages/cart/index'
    })
  }
 
 
})