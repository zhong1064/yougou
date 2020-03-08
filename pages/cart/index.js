// pages/cart/index.js
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
    allPrice: 0,
    //全选的状态
    allSelect:true
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
    this.setData({
        goodList: wx.getStorageSync('goods') || []
      }),
      //计算总价
      this.calcPrice() 

    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
        cartCount: (wx.getStorageSync('goods') || []).length
      })
    }
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
      if(v.select){
        price += (v.goods_price * v.number)
      }
     
    })
    this.setData({
      allPrice: price
    })
    //存入本地
    wx.setStorageSync('goods', this.data.goodList)
  },
  //点击加减数量
  handleAdd(e) {
    const {
      index,
      number
    } = e.target.dataset
    this.data.goodList[index].number += number
    //判断当输入框的值是0的时候提示用户是否删除商品
    if (this.data.goodList[index].number == 0) {
      wx.showModal({
        title: '提示',
        content: '是否删除商品',
        success: (res) => {
          if (res.confirm) {
            //删除商品
            this.data.goodList.splice(index, 1)
          } else if (res.cancel) {
            this.data.goodList[index].number += 1
          }
          //重新修改data里面的值
          this.setData({
            goodList: this.data.goodList
          })
          this.calcPrice()
        }
      })

    }
    //重新修改data里面的值
    this.setData({
      goodList: this.data.goodList
    })
    //计算总价格
    this.calcPrice()
  },
 // 点击单选按钮修改选中状态
  handleSelect(e){
    //点击的产品索引
    const {index} = e.target.dataset 
    
    // 点击产品的选中状态
    let {select} = this.data.goodList[index] 
    
    //取反选中产品的状态
    this.data.goodList[index].select = !select 
    //修改data里面的值
    this.setData({
      goodList:this.data.goodList
    })

    //计算总价
    this.calcPrice()
    //判断全选状态
    this.handAllselect()
  },
  //判断全选的状态
 handAllselect(){
   let newSelect =  this.data.goodList.some( v => {
     return !v.select
    })
   this.setData({
     allSelect: !newSelect
   })
  },
  //点击全选按钮，做出全选和全不选
  handleTabAllselect(){
    const {allSelect} = this.data 
    //循环修改状态
    this.data.goodList.forEach( v => {
      v.select = !allSelect
    })
    //修改data中的数据
    this.setData({
      allSelect:!allSelect,
      goodList:this.data.goodList
    })
    this.calcPrice()
  },
  //输入框失焦事件
  handBlur(e){
   //获取当前点击的商品和输入框的值
   const {index} = e.target.dataset
   let {value} = e.detail
   value = Math.floor(Number(value))
   if(value < 1){
     value = 1
   }
   this.data.goodList[index].number = value 
   this.setData({
     goodList:this.data.goodList
   })
   this.calcPrice()
  }


})