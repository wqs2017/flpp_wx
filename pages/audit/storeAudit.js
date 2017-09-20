// pages/audit/storeAudit.js

var app = getApp();
const jsonCity = require('./cityJson.js'); 
const qiniuUploader = require("../../utils/upload");

// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'NCN', // 华北区
    uptokenURL: app.reqUrl + '/getToken',
    // uptoken: 'xxxx',
    domain: 'http://owaymx0vd.bkt.clouddn.com',
    shouldUseQiniuFileName: false
  };
  qiniuUploader.init(options);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageStatus:1,
    info:{
      brand:'',
      store:'',
      addr:'',
      area:'',
      username:'',
      tel:'',
      code:'',
      platform:'',
      idcard:'',
      bussiness:'',
      photo:'',
      logo:'',
    },
    platformStatus:[0,0,0,0,0],
    city:'',
    pickerStatus:false,
    pickerValue:[0,0],
  },

  uploadImg:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.uploadFile({
          url: 'https://flpp.shanshizhe.cn' + '/uploadFile',
          filePath: res.tempFilePaths[0],
          name: 'image',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          formData: {},
          success: function (res) {
            console.log(res); 
            var data = JSON.parse(res.data);
            console.log(data);
            if(index==0){
              that.setData({
                'info.idcard':data.messages.img
              })
            }else if(index==1){
              that.setData({
                'info.bussiness': data.messages.img
              })
            } else if (index == 2) {
              that.setData({
                'info.photo': data.messages.img
              })
            } else if (index == 3) {
              that.setData({
                'info.logo': data.messages.img
              })
            }
            console.log('上传返回结果')
          }
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.request({
      // url:'/user/perfectUserInfo',
      url:'/user/getAuthInfo',
      success:function(res){
        console.log(res);
        var info = res.data.messages.auth;
        if (info.platform){
          info.platform = (info.platform).split(',');
        }
        console.log(info.platform);
        var status = res.data.messages.auth.status;
        if(status==2){
          that.setData({
            pageStatus: 0
          })
        }else{
          that.setData({
            pageStatus: 1,
            info:info,
          })
        }
        
        console.log('test');
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
    var that = this;
    that.setData({
      city: jsonCity.data.cities[0].counties
    })
    console.log(that.data.city);
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
  //  输入
  // 品牌输入
  brandInput:function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({
      'info.brand':value
    })
  },
  // 门店输入
  storeInput:function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({
      'info.store': value
    })
  },
  // 门店地址输入
  addrInput:function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({
      'info.addr': value
    })
  },
  // 所属区域
  areaPickerShow:function(){
    this.setData({
      pickerStatus: true
    })
  },
  areaPickerHide:function(){
    this.setData({
      pickerStatus:false
    })
  },
  areaSure:function(){
    var that = this;
    var city = that.data.city;
    var value = that.data.pickerValue;
    var name = city[value[0]].name;
    var circles = city[value[0]].circles[value[1]].name;
    var str = name+'-'+circles;
    this.setData({
      'info.area':str,
      pickerStatus: false
    })
    console.log(this.data.info.area);
  },
  pickerChange:function(e){
    var that = this;
    var value = e.detail.value;
    console.log(value)
    that.setData({
      pickerValue:value,
    })


  },
  // 管理员
  usernameInput:function(e){
    var value = e.detail.value;
    this.setData({
      'info.username': value
    });
  },
  // 手机号
  telInput:function(e){
    var value = e.detail.value;
    this.setData({
      'info.tel': value
    });
  },
  // 邀请码
  codeInput:function(e){
    var value = e.detail.value;
    this.setData({
      'info.code': value
    });
  },
  platformSelect:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var status = that.data.platformStatus[index];
    if(status == 0){
      status =1;
    }else{
      status = 0;
    }
    var data = that.data.platformStatus;
    data[index] = status;
    var str = data.toString();
    // for(var i=0;i<data.length;i++){
    //   str
    // }
    that.setData({
      platformStatus:data,
      'info.platform':str,
    });

  },
  // 提示
  auditAlertTip:function(){
    var str = '必要信息';
    wx.showModal({
      title: '请填写'+str,
      content: '',
    })
  },
  auditBtn:function(){
    var that = this;
    app.request({
      url:'	/user/perfectUserInfo',
      data:that.data.info,
      success: function (res) {
        console.log(res);
        if(res.data.errorcode ==200){
          // 审核中状态
          getApp().globalData.status = 0;
          wx.showModal({
            title: '认证信息已上传，请耐心等待管理员审核',
            showCancel:false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
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

      }
    })
  },

})