// pages/passDetail/passDetail.js
var app = getApp();
const util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:'',
    platform:'',
    totalClickNum:0,
    nowNum:0,
    clickNum:[0,0,0,0,0],
    saveNum: [0, 0, 0, 0, 0],
    imgs:['','','','',''],
    uploadStatus:[0,0,0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  uploadImg:function(e){
    console.log(e);
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '正在上传',
        });
        var arr = that.data.uploadStatus;
        arr[index] = 1
        that.setData({
          uploadStatus: arr
        })
        wx.uploadFile({
          url: 'https://flpp.shanshizhe.cn' + '/uploadFile',
          filePath: res.tempFilePaths[0],
          name: 'image',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            var data = JSON.parse(res.data);
            var img = data.messages.img;
            var imgs = that.data.imgs;
            imgs[index] = img;
            arr[index] = 0
            that.setData({
              imgs:imgs,
              uploadStatus: arr
            })

          },
          fail: function () {
            wx.showModal({
              title: '上传失败',
            })
          },
          complete: function () {
            wx.hideLoading();
          }
        })
      },
      fail: function () {
        setTimeout(function () {
          wx.hideLoading();
        }, 1000)
      },
    })
  },
  onLoad: function (options) {
    var that = this;
    app.request({
      url:'/index/getOrderDetail',
      data:{order_id:options.id},
      success:function(res){
        console.log(res);
        if(res.data.errorcode){
          var platform = res.data.messages.platform;
          var order = res.data.messages.order;
          platform = platform.split(',');
          that.setData({
            platform: platform,
            order: order,
            totalClickNum:order.num,
          })
          that.clickNum();
        }else{
          wx.showModal({
            title: '请求错误',
          })
        }
      },
      fail:function(){
        wx.showModal({
          title: '请求失败',
        })
      }
    })
  },
  addNumA:function(){
    var num = this.data.clickNum[0];
    var totalNum = this.data.totalClickNum;
  },
  clickNum:function(){
    var platForm=this.data.platform;
    var totalNum = this.data.order.num;
    var num = 0;
    for(var i=0;i<platForm.length;i++){
      if(platForm[i]==1){
        num+=1
      }
    };
    var averageNum = Math.floor(totalNum/num);
    var surplusNum = totalNum - averageNum*num;
    var clickNum = this.data.clickNum;
    // 设置每个数量
    for (var j = 0; j < platForm.length; j++){
      if(j==0){
        clickNum[j] = averageNum+surplusNum;
      }else if(platForm[j] == 1){
        clickNum[j] = averageNum;
      }else{
        clickNum[j] = 0;
      }
    }
    this.setData({
      clickNum:clickNum,
      saveNum:clickNum,
      nowNum:totalNum,
    })
  },
  // 投放数量增减
  addNum:function(e){
    var index = e.currentTarget.dataset.index;
    var arr = this.data.clickNum;
    var nowNum = this.data.nowNum+1;
    arr[index] = arr[index] + 1
    this.setData({
      clickNum: arr,
      nowNum:nowNum
    })

  },
  subNum:function(e){
    var index=e.currentTarget.dataset.index; 
    var arr = this.data.clickNum;
    var nowNum = this.data.nowNum - 1;
    arr[index] = arr[index]-1
    this.setData({
      clickNum:arr,
      nowNum:nowNum
    })

  },
  // 结束投放
  endBtn:function(){
    var arr = this.data.clickNum;
    var str = arr.toString();
    var imgs = this.data.imgs;
    var imgsStr = imgs.toString();
    var order = this.data.order;
    // 检查是否上传凭证
    for(var i=0;i<arr.length;i++){
      if(arr[i]!=0&&imgs[i]==''){
        wx.showModal({
          title: '请上传投放相应平台的凭证',
        })
        return
      }
    }
    wx.showLoading({
      title: '正在提交',
    })
    console.log({
      order_id: order.order_id,
      push_num: str,
      imgs: imgsStr,
    })
    app.request({
      url:'/index/deliveryGood',
      data:{
        order_id:order.order_id,
        push_num:str,
        imgs:imgsStr,
      },
      success:function(res){
        console.log(res);
        wx.hideLoading();
        if(res.data.errorcode == 200){
          wx.showModal({
            title: '投放成功',
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              });
            }
          })

        }else{
          wx.showModal({
            title: '提交失败,服务器错误',
          })
        }

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
  
  }
})