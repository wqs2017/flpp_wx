//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello',
    userInfo: {},
    list: [],
    pageTotal:1,
    pageNum:1,
    scrollTop:0,
  },
  //事件处理函数
  pageScroll:function(){
    console.log(1);
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    // 获取用户信息
    wx.showLoading({
      title: '数据加载中',
    })

  },
  onShow:function(){
    var that = this;
    // wx.navigateTo({
    //   url: '../passDetail/passDetail'
    // });
    // wx.navigateTo({
    //   url: '../audit/storeAudit'
    // })
    // wx.navigateTo({
    //   url: '../test/test'
    // })

    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo
      });
      app.request({
        url: '/index/getIndex',
        method: 'POST',
        data: { pageNum: 1 },
        success: function (res) {
          wx.hideLoading();
          console.log(res)
          var list = res.data.messages.data;
          that.setData({
            list: list,
            pageNum:1,
            pageTotal: res.data.messages.total_page
          })
        },
      })
    })
  },
  // 跳转
  goBuy:function(){
   wx.navigateTo({
     url: '../buy/buy',
   })
  },
  goDetail:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../productDetail/productDetail?id='+id,
    })
  },
  goPersonal:function(){
    wx.navigateTo({
      url: '../personal/personal',
    })
  },
  onShareAppMessage: function () {
      return {
        title: '福利派派，送福利啦',
        desc: '',
        path: '/pages/index/index'
      }
  },

  // add list
  addList:function(){
    var that=this;
    var pageNum = that.data.pageNum+1;
    that.setData({
      pageNum: pageNum,
    })
    if(pageNum<=that.data.pageTotal){
      wx.showLoading({
        title: '加载中...',
      })
      app.request({
        url: '/index/getIndex',
        method: 'POST',
        data: { pageNum: pageNum },
        success: function (res) {
          wx.hideLoading();
          console.log(res)
          var newList = res.data.messages.data;
          var list = that.data.list;
          for (var i = 0; i < newList.length; i++) {
            list.push(newList[i]);
          }
          that.setData({
            list: list,
          })

        },
      })
    }

  },
  })
