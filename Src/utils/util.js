const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getScreenScale(){
  var windowScale = 0
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      windowScale = windowHeight / windowWidth;
    }
  })

  console.log(windowScale)
  return windowScale
}

function imageResize(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽
  var originalHeight = e.detail.height;//图片原始高
  var originalScale = originalHeight / originalWidth;//图片高宽比
  //console.log('originalWidth: ' + originalWidth)
  //console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;
      //console.log('windowWidth: ' + windowWidth)
      //console.log('windowHeight: ' + windowHeight)
      //console.log('windowscale: ' + windowscale)
      //console.log('originalHeight / originalWidth: ' + originalHeight / originalWidth)
      imageSize.imageWidth = windowWidth;
      imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
    }
  })
  //console.log('缩放后的宽: ' + imageSize.imageWidth)
  //console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}

function getGiftsDiscountRoll(){
  return []
}

function openShopPage() {
  var link = encodeURI("https://mall.video.qq.com/home?&ptag=4_6.2.0.21726_copy")
  wx.navigateTo({
    url: '../outsideWebkit/outsideWebkit?url=' + link
  })
}

module.exports = {
  formatTime: formatTime,
  imageResize: imageResize,
  getGiftsDiscountRoll: getGiftsDiscountRoll,
  openShopPage: openShopPage,
  getScreenScale: getScreenScale
}
