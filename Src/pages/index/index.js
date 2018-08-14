// pages/swiper/swiper.js
var util = require('../../utils/util.js');
var network = require('../../network/requester.js');
var app = getApp();

Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,

    backgroundImageWidth: 0,
    backgroundImageHeight: 0,
    backgroundSrc: '../images/background.png',
    swiperBackgroundSrc: '../images/column_swiper.png',
    challangeImageSrc: '../images/challenge.png',
    helpImageSrc: '../images/help.png',
    watchRankingListImageSrc: '../images/watch_ranking_list.png',
    tinyCircleImageSrc: '../images/tiny_circle.png',
    myGiftsImageSrc: '../images/my_gifts.png',
    emptyRollsPageSrc: 'https://miniprojpic-1253852788.cos.ap-guangzhou.myqcloud.com/empty-gifts-page.png',

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showGiftsPage: false,

    isDownloadingGiftsPage: false,
    gifts_rolls: [],

    // 标签名字，现在由前端写死
    tabName: ['综艺', '动漫', '影视'],
    currentTabIndex: 0,
    currentCatalogIndex: 0,
    tabContent: [],

    goods: [],
  },

  onLoad: function () {
    var that = this

    this.setData({
      currentTabIndex: 0
    })

    for (var index = 0; index < this.data.tabName.length; index++) {
      var currentTabName = this.data.tabName[index]
      let data = { question_channel: currentTabName }

      network.post(network.hostGetQs, data, function (target, that, res) {
        return function (res) {
          var tabContent = that.data.tabContent
          tabContent[target] = res.data
          that.setData({
            tabContent: tabContent
          })

          for (var catalogIndex = 0; catalogIndex < tabContent[target].length; catalogIndex++) {
            let data = { qs_id: tabContent[target][catalogIndex].qs_id, number: 10 }
            network.post(network.hostGetGoods, data, function (target, catalogIndex, that, res) {
              return function (res) {
                var goods = that.data.goods
                var goodsTarget = goods[target]

                if (goodsTarget == undefined) {
                  goods[target] = []
                  goodsTarget = goods[target]
                }

                goodsTarget[catalogIndex] = res.data
                that.setData({
                  goods: goods
                })
              }
            }(target, catalogIndex, that)
            )
          }
        }
      }(index, this))
    }

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

  imageLoad: function (e) {
    var scale = util.getScreenScale()
    console.log("scale" + scale)
    if (scale <= 1.60) {
      // 超小机型

    } else if (scale <= 1.609) {
      // ip6
      this.setData({
        backgroundSrc: "https://miniprojpic-1253852788.cos.ap-guangzhou.myqcloud.com/background-ip6.png"
      })

    } else if (scale <= 1.6231884057971016) {
      //ip6 plus
      this.setData({
        backgroundSrc: "https://miniprojpic-1253852788.cos.ap-guangzhou.myqcloud.com/background-ip6p.png"
      })

    } else {
      //ipx
      this.setData({
        backgroundSrc: "https://miniprojpic-1253852788.cos.ap-guangzhou.myqcloud.com/background-ipx.png"
      })
    }

    var imageSize = util.imageResize(e);
    this.setData({
      backgroundImageWidth: imageSize.imageWidth,
      backgroundImageHeight: imageSize.imageHeight
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '震惊！！！',
      path: '/pages/index/index',
      success: function (res) {
        console.log(res)
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) {
            console.log(res)
            wx.showModal({
              content: "测试点1" + JSON.stringify(res),
              showCancel: false
            });
          },
          fail: function (res) {
            console.log(res)
            wx.showModal({
              content: "测试点2" + JSON.stringify(res),
              showCancel: false
            });
          }
        })
      }
    }
  },

  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
  openQuestionPage: function () {
    // 前端特判一下
    if (this.data.currentTabIndex == 1 || this.data.currentTabIndex == 2) {
      wx.showModal({
        content: '挑战赛尚未开放喔~敬请期待~',
        showCancel: false
      })
      return;
    }
    var curIndex = this.data.currentTabIndex
    var curCatalogIndex = this.data.currentCatalogIndex
    app.setCurrentQuestionCatalogBriefData(this.data.tabContent[curIndex][curCatalogIndex])
    wx.navigateTo({
      url: '../question_page/question_page'
    })
  },
  openConversionGiftsPage: function () {
    util.openShopPage()
  },
  openRankList: function () {
    console.log("openRankList call")
    wx.navigateTo({
      url: '../ranklist/ranklist?qs_id=' + 1
    })
  },
  openHelpPage: function () {
    console.log("openHelpPage call")
    wx.navigateTo({
      url: '../help_page/help_page'
    })
  },
  clickTab: function (e) {
    if (this.data.currentTabIndex === e.target.dataset.current) {
      return false;
    } else {
      console.log(e.target.dataset.current)

      this.setData({
        currentTabIndex: e.target.dataset.current,
        currentCatalogIndex: 0
      })
    }
  },
  onGiftsImageClick: function (e) {
    console.log("onGiftsImageClick")
    this.setData({
      showGiftsPage: !this.data.showGiftsPage
    });

    let data = { user_id: 12360 }
    var that = this
    network.post(network.hostGetUserprizes, data, res => {
      that.setData({
        gifts_rolls: res.data
      });
    })
  },
  onClickedGiftsDialogView: function () {
    this.setData({
      showGiftsPage: !this.data.showGiftsPage
    });
  },
  onQuestionCatalogChange: function (e) {
    this.setData({
      currentCatalogIndex: e.detail.current
    })
  },
  getUserInfo: function (e) {
    if (e.detail.errMsg === "getUserInfo:fail auth deny") {
      console.log("deny!!!!")
      wx.showModal({
        content: "您选择了拒绝授权，排行记录将无法上传到服务器哦~",
        showCancel: false
      });
      return;
    }

    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    var user_id = e.detail.userInfo
    var user_url = e.detail.userInfo.avatarUrl
    var nickName = e.detail.userInfo.nickName

    /*
    let data = { user_id: 23, nickname: nickName, user_url: user_url }
    network.post(network.hostPostUserRegister, data, res=>{
      console.log("chanllange")
      console.log(res)
    })
    */
  }
})


