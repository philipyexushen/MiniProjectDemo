// pages/swiper/swiper.js
var imageUtil = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    background: ['', '', ''],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,

    backgroundImageWidth: 0,
    backgroundImageHeight: 0,
    backgroundSrc: '../images/background.png',
    swiperBackgroundSrc: '../images/column_swiper.png',
    challangeImageSrc:'../images/challenge.png',
    helpImageSrc: '../images/help.png',
    watchRankingListImageSrc: '../images/watch_ranking_list.png',

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentTab: 0
  },

  imageLoad: function (e) {
    var imageSize = imageUtil.imageResize(e);
    this.setData({
      backgroundImageWidth: imageSize.imageWidth,
      backgroundImageHeight: imageSize.imageHeight
    })
  },

  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 按下挑战图片，打开答题页
  openQuesionPage: function(){
    wx.navigateTo({
      url: '../question_page/question_page'
    })
  },
   openHelpPage: function () {
    wx.navigateTo({
      url: '../help_page/help_page'
    })
  },
  clickTab: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})

