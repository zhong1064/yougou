// pages/cart/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //渲染页面的本地数据  
    goodList: [],
    //获取的地址个人信息
    address: {
      name: '',
      tel: '',
      detail: ''
    },
    //总价
    allPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取用户地址信息
    let ads = wx.getStorageSync('address') || {}
    this.setData({
      address: ads
    })
  },
  // 因为onLoad只会加载一次，需要的是每次打开页面都执行 用onShow
  onShow() {
    //如果购物车没勾选，订单确认页就不显示
    let goods = wx.getStorageSync('goods') || [] 
     goods = goods.filter( v => {
         return v.select
       })
    this.setData({
        goodList: goods
      })
    this.calcPrice()

  },

  //点击获取地址信息
  handleGetaddress() {
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          address: {
            name: res.userName,
            tel: res.telNumber,
            detail: res.provinceName + res.cityName + res.countyName + res.detailInfo
          }
        })
        //把地址信息存入本地
        wx.setStorageSync('address', this.data.address)
      }
    })
  },

  // 计算总价
  calcPrice() {
    let price = 0
    this.data.goodList.forEach(v => {
      price += (v.goods_price * v.number)
    })
    this.setData({
      allPrice: price
    })
   
  },
  //立即支付事件
  handlePay(){
    //先判断本地是否有token
    let token = wx.getStorageSync('token')
    //如果没有token跳转到授权页
    if(!token){
      wx.navigateTo({
        url: '/pages/authorize/index',
      })
    }else {
      let  {goodList,allPrice,address} = this.data 
        goodList =  goodList.map( v => {
        return {
          goods_id:v.goods_id,
          goods_number:v.number,
          goods_price:v.goods_price
        }
      })
      //创建订单
      request({
        url:'/my/orders/create',
        method:'POST',
        header:{
          Authorization: wx.getStorageSync('token')
        },
        data:{
          order_price:allPrice,
          consignee_addr:address.name + address.tel + address.detail,
          goods: goodList
        }
      }).then( res => {
        // 订单创建成功的提示
        wx.showToast({
          title: '订单创建成功',
          type: "success"
        })
        const { order_number} = res.data.message 
        //获取支付参数 
          request({
            url:'/my/orders/req_unifiedorder',
            method:'POST',
            header: {
              Authorization: wx.getStorageSync('token')
            },
            data:{
              order_number
            }
          }).then(res => {
            const {pay} = res.data.message 
            //发起微信支付
            wx.requestPayment(pay)
          })
         //支付成功后，删除购物车中以支付的数据
        let datalist = wx.getStorageSync('goods') 
      datalist =  datalist.filter( v => {
          return !v.select
        })
        console.log(datalist)
       
        wx.setStorageSync('goods', datalist)
      })
    }
  }

})