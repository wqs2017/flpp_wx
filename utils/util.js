function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function uploadImg(resolve, reject){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        console.log('选择图片了');
        wx.uploadFile({
          url: 'https://flpp.shanshizhe.cn' + '/uploadFile',
          filePath: res.tempFilePaths[0],
          name: 'image',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          formData: {},
          success: function (res) {
            console.log(res)
            var data = JSON.parse(res.data);
            var img = data.messages.img;
            resolve(img);
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

}
// 调用
// var img = new Promise(function (resolve, reject) {
//   util.uploadImg(resolve, reject)
// });
// img.then(function (res) {
//   console.log(res);

// })

module.exports = {
  formatTime: formatTime,
  uploadImg: uploadImg
}
