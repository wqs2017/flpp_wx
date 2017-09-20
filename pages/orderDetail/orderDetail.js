// pages/orderDetail/orderDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnStatus:true,
    orderData:{
      num: 1,
      send_date:'',
      good_id:''
    },
    orderId:'',
    product:'',
    addr:{
      username:'...',
      tel:'...',
      addr:'...'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 商品信息
    if(options.id){
      var num = options.num;
      var id = options.id;
      var date = (new Date().toLocaleDateString()).replace(/\//g, '.');
      that.setData({
        'orderData.num': num,
        'orderData.good_id': id,
        'orderData.send_date': date,
      })
      app.request({
        url: '/index/getGoodDetail',
        data: { good_id: id },
        success: function (res) {
          console.log(res)
          that.setData({
            product: res.data.messages.good,
          })
        }
      })
      // 地址
      app.request({
        url: '/index/getAddr',
        success: function (res) {
          console.log(res)
          that.setData({
            addr: res.data.messages.addr,
          })
        }
      })
    }else if(options.orderid){
      // 查看
      app.request({
        url: '/index/getOrderDetail',
        data: { order_id: options.orderid},
        success: function (res) {
          console.log(res)
          var order = res.data.messages.order;
          var good = {
            good_name:order.good_name,
            good_img:order.good_img,
            num:order.num,
            brand:order.brand,
          }
          console.log(good)
          var addr = {
            username: order.username,
            tel: order.tel,
            addr: order.addr,
          }
          var date = (new Date(parseInt(order.create_date
          )).toLocaleDateString()).replace(/\//g, '.');
          that.setData({
            product: good,
            addr:addr,
            'orderData.send_date':date,
          })
        }
      })
    }

    if(options.watch){
      that.setData({
        btnStatus:false,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
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
  
  },
  // 采购商品
  orderBtn:function(){

    var that = this;
    that.setData({
      btnStatus:false,
    })

    app.request({
      url: '/index/insertOrder',
      data: that.data.orderData,
      success: function (res) {
        console.log(res);
        if(res.data.errorcode == 200){
          // 采购成功
          wx.showModal({
            title: '采购成功',
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 2
              });
            }
          })
        }else{
          wx.showModal({
            title: res.data.messages.errorinfo,
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              });
            }
          })
        }
      },
      fail:function(){
        wx.showModal({
          title: '请求失败，检查网络',
          showCancel: false,
          success: function (res) {
            wx.navigateBack({
              delta: 1
            });
          }
        })
      }
    })
    
  }
})