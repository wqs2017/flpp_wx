//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  reqUrl:'https://flpp.shanshizhe.cn',
  login:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            // 发起网络请求
            wx.request({
              method: 'POST',
              url: getApp().reqUrl + '/user/sign',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              data: {
                code: res.code,
              },
              success:function(res){
                console.log(res);
                // 获得sessionID
                that.globalData.sessionID = res.data.messages.third_session;
                //  获取用户信息
                wx.getUserInfo({
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo;
                    typeof cb == "function" && cb(that.globalData.userInfo);
                  },
                  fail: function (res) {
                    that.loginFail(function (userInfo) {
                      typeof cb == "function" && cb(that.globalData.userInfo);
                    });
                  },
                  complete: function (res) {
                    console.log(res);
                    getApp().request({
                      url:'/user/getUserInfo',
                      method: 'POST',
                      data: {
                        encryptedData: res.encryptedData,
                        iv:res.iv,
                        rawData:res.rawData,
                        signature: res.signature,
                      },
                      success: function (res) {
                        console.log(res);
                        that.globalData.status = res.data.messages.status;
                        that.globalData.score = res.data.messages.score;
                        that.globalData.store = res.data.messages.store;
                        console.log('获得最终user');
                      }  
                    })
                  }
                })  
                
              },
              fail:function(res){
                console.log(res);
              }
            })


          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }

        }
      })
    }
  },
  // 封装请求
  request: function (obj) {
    var that = this;
    obj.data = obj.data || {};
    obj.url = that.reqUrl + obj.url;
    obj.method = obj.method || 'POST';
    that.getSessionID(function () {
      obj.header = {
        'content-type': 'application/x-www-form-urlencoded',
        'third_session': that.globalData.sessionID
      };
      wx.request(obj);
    })
  },
  // 获取sessionID
  getSessionID: function (cb) {
    var that = this
    wx.checkSession({
      success: function () {
        if (that.globalData.sessionID) {
          cb(that.globalData.sessionID)
        } else {
          console.log(123);
          // that.login((sessionID) => {
          //   cb(sessionID)
          // })
        }
      },
      fail: function () {
        // that.login((sessionID) => {
        //   cb(sessionID)
        // })
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      // 调用登录接口
      that.login(function(userInfo){
        typeof cb == "function" && cb(userInfo)
      });
    }

  },
  loginFail: function (cb) {
    var that = this;
    wx.openSetting({
      success: function (res) {
        if (res.authSetting["scope.userInfo"] == true) {
          console.log('勾选');
          wx.getUserInfo({
            withCredentials: false,
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        } else if (res.authSetting["scope.userInfo"] != true){
          that.loginFail(cb);
        }
      },
      fail:function(){
        that.loginFail(cb);
      }
    })
  },
  globalData:{
    userInfo:null,
    sessionID: '',
    header: '',
    status:0,
    score:0,
    store:'',
  }
})