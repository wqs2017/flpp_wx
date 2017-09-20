// pages/productDetail/productDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:null,
    limitNum:5,
  },

  subLimitNum:function(){
    var that = this;
    var limitNum = that.data.limitNum-5;
    that.setData({
      limitNum:limitNum
    })
  },
  addLimitNum: function () {
    var that = this;
    var limitNum = that.data.limitNum + 5;
    that.setData({
      limitNum: limitNum
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that= this;
    console.log(options.id);
    app.request({
      url: '/index/getGoodDetail',
      method: 'POST',
      data: { good_id: options.id },
      success: function (res) {
        console.log(res);
        var product = res.data.messages.good
        if (typeof product.img == 'string') {
          product.img = product.img.split(',');
        }
        if (typeof product.good_image == 'string') {
          product.good_image = product.good_image.split(',');
        }
        that.setData({
          product: product,
        });
      },
    })

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
  // 订阅日历
  orderBtn:function(e){
    wx.showModal({
      title: '即将上线，尽请期待',
      showCancel: false,
      success: function (res) {
        wx.navigateBack({
          delta: 1
        });
      }
    })
    return
    var that = this;
    var num = that.data.limitNum;
    var id = that.data.product.good_id;
    var status = parseInt(getApp().globalData.status);
    console.log(status);
    console.log('status')
    if(status==1){
      wx.navigateTo({
        url: '../orderDetail/orderDetail?num=' + num + '&id=' + id
      })
    }else if(status == 2){
      wx.showModal({
      title: '尚未认证门店信息，前往认证？',
      cancelText:'返回',
      confirmText:'前往',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../personal/personal'
          })
        } else if (res.cancel) {
          wx.navigateBack({
            delta: 1
          });
        }
      }

    })
    } else {
      wx.showModal({
      title: '您的门店资料正在审核中，请耐心等待^_^',
      showCancel: false,
      success: function (res) {
        wx.navigateBack({
          delta: 1
        });
      }
    })
    }

  },
  // 获取当月共多少天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  // 获取当月第一天星期几
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  // 保存图片
  savePic:function(){
    wx.getImageInfo({
      src:'http://os5edz5i3.bkt.clouddn.com/xx_score_3.png',
      success:function(res){
        console.log(res);
        var path = res.path;
        wx.showModal({
          title: '是否保存图片',
          content: '',
          success: function (res) {
            if (res.confirm) {
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success: function (res) {
                  console.log(res);
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 1200
                  })
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      },
      fail:function(res){
        console.log(res);
      }
    })    
  }


})