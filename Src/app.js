//app.js
var questionCatalogBriefData = { 
  qs_logo: null, 
  qs_tilte: "创造101", 
  free_prizes_left: 50, 
  qs_id: 1, 
  answering_number: 0 
}

App({
  setCurrentQuestionCatalogBriefData: function(data){
    questionCatalogBriefData = data
  },

  getCurrentQuestionCatalogBriefData : function(){
    return questionCatalogBriefData
  },

  onLaunch: function (options) {
    this.globalData.scene = options.scene // 记录
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.clientHeight = res.windowHeight
        that.globalData.clientWidth = res.windowWidth
        that.globalData.statusBarHeight = res.statusBarHeight
        that.globalData.model = res.model
        console.log("xxxx", res)
        console.log(res.screenHeight - res.windowHeight)
      }
    });

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.showShareMenu({
      withShareTicket: true
    })

    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log("login")
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  
  globalData: {
    userInfo: null,
    // dbConfig: { host: '118.25.208.124', port: 5001 }
    dbConfig: { host: 'https://www.defphilip.com', port: '' }
  },
  getUserId: function (loginCode, userInfo, callback) {
    var rawData = JSON.parse(userInfo.rawData)
    wx.request({
      url: this.globalData.dbConfig.host + '/api/userlogin',
      data: {
        js_code: loginCode,
        user_url: rawData.avatarUrl,
        nickname: rawData.nickName,
        appid: 'wxe8b4e92b785c131f',
        secret: '6cfbeb90f1dfc03dd0308a1d67b6ec92'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      success: function (res) {
        callback(res)
      }
    })
  },
})