// pages/cart/index.js
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数据
     banners:[],
     //菜单数据
     lists:[],
     //楼层数据
     floors:[],
     isTop:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
 onLoad(){
   //请求轮播图数据
   request({
     url:'/home/swiperdata'
   }).then(res => {
     const {message} = res.data
       this.setData({
         banners:message
       })
   }),
   //请求导航栏数据
   request({
     url:"/home/catitems"
   }).then(res => {
    
     const {message} = res.data
     //需要判断第一个要写跳转，数据改造
     const newData = message.map((v,i) => {
       if(i === 0){
         v.url ="/pages/category/index"
       }
       return v
     })
     this.setData({
       list:newData
     })
   })
   //请求楼层数据
   request({
     url: "/home/floordata"
   }).then( res => {
    
     const {message} = res.data
     this.setData({
       floors:message
     })
   })
 },

 //回到顶部 
  tohead(){
    wx.pageScrollTo({
      scrollTop:0,
      duration:300
    })
  },
  //监听滚动条变化
  onPageScroll(e){
    const { scrollTop} = e
   let flag = this.data.isTop 
     if(scrollTop > 100){
        flag = true
     } else {
       flag = false
     }
    if (flag === this.data.isTop) return 
   
    this.setData({
      isTop:flag
    })
  }

 
})