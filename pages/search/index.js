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
     recomend:[],
     //设置一个开关，判断数据是否正在加载
     isLoad:false,
     lastValue:'',
     history:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //获取本地数据
      let arr = wx.getStorageSync('history')
      //如果本地没有数据或者arr不是一个数组
      if(!Array.isArray(arr)){
        arr = []
      }
      this.setData({
        history:arr
      })
  },
  //进行输入框数据绑定
  eventhandle(e){
   
    const {value} = e.detail;
    this.setData({
      inputValue:value
    })
    // 如果Value有值才发起请求
    if(!value){
      //把搜索建议的数组清空
      this.setData({
        recomend:[]
      })
      return
    }
    //调用请求搜索的建议
    this.getRecomend()
    
  },
 
 getRecomend(){
   //判断是否正在加载
   if(this.data.isLoad === false){
     this.setData({
       isLoad:true,
       //记录当前的值
       lastValue:this.data.inputValue 
     })
     request({
       url: "/goods/qsearch",
       data: {
         query: this.data.inputValue
       }
     }).then(res => {
       const { message } = res.data
       this.setData({
         recomend: message,
         isLoad:false
       })
     })
     //判断input的值是否是最近的值,不等于就重新请求数据
     if(this.data.lastValue !== this.data.inputValue){
       this.getRecomend()
     }
   }
  
 },
 // 点击取消触发的事件
  handCanle() {
    this.setData({
      inputValue: '',
      recomend:[]
    })
  },

  //按下回车键触发的函数
  handEnter(){
    let arr = wx.getStorageSync('history')
    //如果本地没有需要添加判断
    if(!Array.isArray(arr)){
      arr = []
    }
    //添加到数组最后一位
    arr.unshift(this.data.inputValue)
    //把搜索的关键字保存到本地
    wx.setStorageSync('history', arr)
    //跳转到商品列表页
    wx.redirectTo({
      url: '/pages/goodlist/index?keyword=' + this.data.inputValue
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