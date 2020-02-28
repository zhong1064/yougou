// pages/cart/index.js
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数据
     banners:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
 onLoad(){
   request({
     url:'/home/swiperdata'
   }).then(res => {
     const {message} = res.data
       this.setData({
         banners:message
       })
   })
 }
   
})