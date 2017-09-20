// pages/buy/buy.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabStatus:0,
    pageNum:1,
    type:1,
    totalPage:1,
    list:null,
  },
  // 切换加载及首次
  loadData:function(index){
    console.log('index'+index);
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.request({
      url: '/index/getOrders',
      data: {
        pageNum: that.data.pageNum,
        type: that.data.type,
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        that.setData({
          tabStatus: index,
        })
        if (res.data.errorcode == 200) {
          var data = res.data.messages.data;
          that.setData({
            list: data,
            totalPage: res.data.messages.total_page,
          })
        } else {
          wx.showModal({
            title: res.data.messages.errorinfo,
            showCancel: false,
          })
        }

      }
    })
  },
  // 事件
  tabBtn:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var type = parseInt(index)+1;
    this.setData({
      type:type,
      pageNum:1,
    });
    that.loadData(index);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var that = this;
    console.log({
      pageNum: that.data.pageNum,
      type: that.data.type,
    })
    // 首次加载
    that.loadData(0);
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
  // 跳转页面
  goOrderDetail:function(e){
    var orderid = e.currentTarget.dataset.orderid;
    var status = e.currentTarget.dataset.status;
    // 2 订单详情 0 1 审核中和未通过
    if(status == 2){
      wx.navigateTo({
        url: '../passDetail/passDetail?id='+orderid
      })
    }else{
      // 
      wx.navigateTo({
        url: '../orderDetail/orderDetail?watch=true&orderid='+orderid
      })
    }
  },

})