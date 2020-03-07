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
  // 点击购物车,跳转购物车页
  handleToCart(){
    wx.switchTab({
      url: '/pages/cart/index'
    })
  },
  // 把商品加入到本地购物列表
  handleAddCart(){
      // 需要先判断本地是否有数据
    const goods = wx.getStorageSync('goods') || [] 
    //用some方发判断goods数组中是否包含目前点击的产品，如果包含，产品的数量加1
  let result =  goods.some(v => {
      let isExit = v.goods_id === this.data.detail.goods_id
      if(isExit){
        v.number +=1
        //给出提示
        wx.showToast({
          title: '数量+1',
          icon: 'success',
        })
      } 
      return isExit
    })
    //当在本地没有相同的数据时，直接存入本地数组
    if(!result){
      goods.unshift({
        goods_id: this.data.detail.goods_id,
        goods_name: this.data.detail.goods_name,
        goods_price: this.data.detail.goods_price,
        goods_small_logo: this.data.detail.goods_small_logo,
        number: 1
      })
      //给出提示
      wx.showToast({
        title: '加入成功',
        icon: 'success',
      })
    }
    // 存入本地
    wx.setStorageSync('goods', goods)

  }
 
 
})