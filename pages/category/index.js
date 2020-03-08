// pages/category/index.js

import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
     current:0,
     category:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     request({
       url:'/categories'
     }).then(res => {
    
      const {message} = res.data
      this.setData({
        category:message
      })
     })
  },

 //点击左侧列表切换
  handClick(e){
     const {index} = e.target.dataset 
    this.setData({
      current:index
    })
  },
  onShow() {
    // 如需实现 tab 选中态，要在当前页面下，通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        cartCount: (wx.getStorageSync('goods') || []).length
      })
    }
  },
  
})