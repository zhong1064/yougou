// pages/search/index.js
import request from '../../utils/request.js'
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
     //输入框的值
     inputValue:'',
     //输入建议
     recomend:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
  },
  //进行输入框数据绑定
  eventhandle(e){
   
    const {value} = e.detail;
    this.setData({
      inputValue:value
    })
    request({
      url:"/goods/qsearch",
      data:{
        query:this.data.inputValue
      }
    }).then(res => {
      console.log(res)
      const {message} = res.data
      this.setData({
        recomend:message
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})