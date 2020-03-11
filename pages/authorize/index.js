// pages/authorize/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
//点击授权按钮获取用户信息
  handleUserInfo(e){
   
    const { encryptedData, rawData, iv, signature} = e.detail
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
           const data = {
             encryptedData,
             rawData,
             iv,
             signature,
             code:res.code
           }
          request({
            url:'/users/wxlogin',
            method:'POST',
            data
          }).then(res => {
           let {token} = res.data.message
           //把token存到本地，并跳转到购物车确认页
            wx.setStorageSync('token', token)
            wx.redirectTo({
              url: '/pages/order_enter/index'
            })
          })
        } 
      }
    })
  }

 
})