// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     //渲染页面的本地数据  
     goodList:[],
     //获取的地址个人信息
     address:{
      name:'',
      tel:'',
      detail:''

     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户地址信息
   let ads = wx.getStorageSync('address') || {} 
   this.setData({
     address:ads
   })
  }, 
  // 因为onLoad只会加载一次，需要的是每次打开页面都执行 用onShow
  onShow(){
     this.setData({
       goodList: wx.getStorageSync('goods') || []
     })
  },

  //点击获取地址信息
  handleGetaddress(){
    wx.chooseAddress({
      success:(res) => {
        this.setData({
         address:{
           name:res.userName,
           tel:res.telNumber,
           detail: res.provinceName + res.cityName + res.countyName + res.detailInfo
         }
        })
        //把地址信息存入本地
        wx.setStorageSync('address', this.data.address)
      }
    })
  },

 
})