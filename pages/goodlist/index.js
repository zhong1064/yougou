// pages/goodlist/index.js
import request from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 列表数据 
     goods:[],
     keyword:'',
     pagenum:1,
     //判断是否正在加载 
     isLoad:true,
    //是否有更多数据
     hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {keyword} = options 
    this.setData({
      keyword
    })
    this.getData()
  },

  // 请求页面数据 
  getData(){
   if(!this.data.hasMore) return
    
    request({
      url: '/goods/search',
      data: {
        query: this.data.keyword,
        pagenum: this.data.pagenum,
        pagesize: 10
      }
    }).then(res => {
      
      const { message } = res.data
      // 遍历修改goods下面的价格 
      const goods = message.goods.map( v => {
          // 给价格保留两个小数点
        v.goods_price = Number(v.goods_price).toFixed(2) 
        return v
      })
      this.setData({
        //合并原来的数据和新请求回来的数据
        goods: [...this.data.goods,...goods],
        //加载完毕
        isLoad:false
       
      })
      // 判断是否还有数据
      if (this.data.goods.length >= message.total){
        this.setData({
          hasMore:false
        })
      }
    })
  },

  //页面下拉触发
  onReachBottom: function () {
    //需要等到上一次数据回来之后才发请求
    if(this.data.isLoad === false){
      this.setData({
        pagenum: this.data.pagenum + 1,
        isLoad:true
      })
      this.getData()
    }
 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})