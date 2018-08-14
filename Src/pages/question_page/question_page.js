const util = require('../../utils/util.js')
const network = require('../../network/requester.js')
var app = getApp();

Page({
  data: {
    backgroundImageWidth: 0,
    backgroundImageHeight: 0,
    backgroundSrc: '../images/question_page/background.png',
    answerTabBackgroundSrc: '../images/question_page/answer_tab_background.png',

    currentPage: 0,
    problems: [],

    tick: 0,
    timer: null,

    answerOriginalTitle: "-第%s题-",
    answerTitle: "",
    index2Char: ['A', 'B', 'C', 'D', 'E', 'F'],
    answerTabClicked: -1,
    answerClicked: false,
    answerCorrect: 0,
    isChoiceCorrect: false,

    // 服务器需要的信息
    totalCorrect : 0,
    correctId : [],
    usedTime : 0,
    userId : 0,
    qsId : 0,

    showResultPageDialog : false,
    resultPageDialogBackgroundSrc: '../images/question_page/failed_dialog_background.png',
    giftRollImageSrc: 'https://miniprojpic-1253852788.cos.ap-guangzhou.myqcloud.com/test_roll_image.png',

    titleFirstLineOriginal:"您挑战到了第%s关\n",
    titleSecondLineOriginal: "超过%s%的人\n",
    titleThirdLineOriginal: "获得一张",

    titleFirstLine: "",
    titleSecondLine: "",
    titleThirdLine: "",

    fakeRank : [8.66, 18.12, 20.99, 38.48, 46.98, 53.34, 65.89, 76.45, 88.56, 99.99],

    // 底部商品展示相关
    goodsInformation :[],
    disccountList: [0.05, 0.08, 0.10, 0.15, 0.20, 0.30, 0.35, 0.40, 0.50, 1.00],
    goodsDiscountPrice:[],

    questionCategoryName: "",
    totalTimeTimer: null,
    totalTime: 0,
    answeredQuestionId : [],

    answerQuestionResponse : {}
  },
  backgroundImageLoad: function (e) {
    var scale = util.getScreenScale()
    console.log("scale" + scale)
    if (scale <= 1.60) {
      // 超小机型

    } else if (scale <= 1.609) {
      // ip6
      this.setData({
        backgroundSrc: "https://miniprojpic-1253852788.cos.ap-guangzhou.myqcloud.com/qu_bakcground-ip6.png"
      })

    } else if (scale <= 1.6231884057971016) {
      //ip6 plus
      this.setData({
        backgroundSrc: "https://miniprojpic-1253852788.cos.ap-guangzhou.myqcloud.com/qu_bakcground-ip6p.png"
      })

    } else {
      //ipx
      this.setData({
        backgroundSrc: "https://miniprojpic-1253852788.cos.ap-guangzhou.myqcloud.com/qu_bakcground-ipx.png"
      })
    }
    
    var imageSize = util.imageResize(e);
    this.setData({
      backgroundImageWidth: imageSize.imageWidth,
      backgroundImageHeight: imageSize.imageHeight
    })
  },
  onLoad: function (e) {
    console.log("onShow question_page");
    var that = this

    this.setNewTitle(1)

    let questionCatalogBriefData = app.getCurrentQuestionCatalogBriefData()
    this.setData({
      questionCategoryName: questionCatalogBriefData.qs_tilte
    })

    let data = { user_id: 12360, qs_name: this.data.questionCategoryName }
    //let data1 = { number: 4, qs_id: 1 }
    console.log(network.hostGetQuestion)
    network.post(network.hostGetQuestion, data, function(that, res){
      return function(res){
        that.setData({
          problems: res.data,
        })
        that.resetTimer()
        that.resetAnswer()

        let questionCatalogBriefData = app.getCurrentQuestionCatalogBriefData()
        let data = { qs_id: questionCatalogBriefData.qs_id, number: 4 }
        network.post(network.hostGetGoods, data, function (res){
          console.log(res.data)
          that.setData({
            goodsInformation : res.data
          })

          var goodsDiscountPrice = []
          for (var index = 0; index < that.data.goodsInformation.length; index++) {
            goodsDiscountPrice[index] = that.data.goodsInformation[index].g_price
          }
          console.log(goodsDiscountPrice)
          that.setData({
            goodsDiscountPrice: goodsDiscountPrice
          })
        })
      }
    }(this))



    wx.showShareMenu({
      withShareTicket: true
    })

    this.data.totalTimeTimer = setInterval(()=>{
      that.setData({
        totalTime: that.data.totalTime + 1
      })
    },1000)
  },
  onUnload : function(e){
    this.claer()
  },
  onAnswerClicked: function (e) {
    if (this.data.answerClicked == false) {
      this.setData({
        answerTabClicked: Number(e.currentTarget.id),
        answerClicked: true
      })

      this.data.answeredQuestionId[this.data.currentPage] = this.data.problems[this.data.currentPage].q_id

      if (this.data.answerTabClicked == this.data.answerCorrect){
        this.data.isChoiceCorrect = true
        var that = this
        this.data.isChoiceCorrect = true
        setTimeout(() => {
          that.onSuccessful()
        }, 1000)
      }else{
        var that = this
        this.data.isChoiceCorrect = false
        setTimeout(()=>{
          that.onResult(false)
        }, 1000)
      }

      clearInterval(this.data.timer)
    }
  },
  onResult: function (result){
    this.postResultToServer(result)
    if (result == false){
      this.setData({
        titleFirstLine: this.data.titleFirstLineOriginal.replace("%s", this.data.currentPage + 1),
        titleSecondLine: this.data.titleSecondLineOriginal.replace("%s", this.data.fakeRank[this.data.currentPage]),
        titleThirdLine: this.data.titleThirdLineOriginal.replace("%s", this.data.questionCategoryName),
        showResultPageDialog: true
      })
    }
    else{
      this.setData({
        titleFirstLine: "闯关成功！\n",
        titleSecondLine: this.data.titleSecondLineOriginal.replace("%s", 99.99),
        titleThirdLine: this.data.titleThirdLineOriginal + '',
        showResultPageDialog: true
      })
    }
  },
  onSuccessful: function (){
    this.setData({
      goodsDiscountPrice: this.getUpdateDiscountPrice()
    })

    // 全答对了！
    if (this.data.currentPage + 1 == this.data.problems.length){
      this.onResult(true)
      return
    }

    this.setData({
      currentPage: this.data.currentPage + 1
    })

    this.setNewTitle(this.data.currentPage + 1)
    this.resetAnswer()
    this.resetTimer()

  },
  setNewTitle : function(index){
    var strTitle = this.data.answerOriginalTitle;
    strTitle = strTitle.replace("%s", index)
    this.setData({
      answerTitle: strTitle
    })
  },
  resetTimer : function(){
    this.setData({
      tick: 10
    })
    var that = this
    this.data.timer = setInterval(() => {
      console.log("timeout! " + that.data.tick)
      that.setData({
        tick: that.data.tick - 1
      })
      if (that.data.tick == 0) {
        clearInterval(that.data.timer)
        that.data.timer = null

        this.onResult(false)
      }
    }, 1000)
  },
  onResultPageDialogCloseButtonClicked : function(e){
    wx.redirectTo({
      url: '../ranklist/ranklist'
    })
    this.setData({
      showResultPageDialog : false
    })
  },
  onGiftRollImageClicked: function () {
    util.openShopPage()
  },
  openConversionGiftsPage: function () {
    util.openShopPage()
  },
  onShareAppMessage: function (res) {
    return {
      title: '答题赢周边大作战',
      path: '/pages/index/index',
      success: function (res) {
        console.log(res)
        var shareTicket = (res.shareTickets && res.shareTickets[0]) || ''
        /* 官网的Tip: 由于策略变动，小程序群相关能力进行调整，
         * 开发者可先使用wx.getShareInfo接口中的群ID进行功能开发。
         */
        wx.getShareInfo({
          // 把票据带上
          shareTicket: shareTicket,
          success: function (res) {
            console.log(res)
            // TODO:分享成功后，可以复活
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
  getUpdateDiscountPrice:function(){
    var goodsDiscountPrice = []
    for (var index = 0; index < this.data.goodsInformation.length; index++) {
      goodsDiscountPrice[index] = Math.floor((1 - this.data.disccountList[this.data.currentPage]) * this.data.goodsInformation[index].g_price)
    }
    return goodsDiscountPrice
  },
  resetAnswer : function(){
    var options = this.data.problems[this.data.currentPage].options
    var total = options.length

    console.log(total)
    for (var index = 0; index < total; index++) {
      if (options[index].opt_correct == 1) {
        this.setData({
          answerCorrect: index
        })
        break
      }
    }
    this.setData({
      answerTabClicked: -1,
      answerClicked: false,
      isChoiceCorrect: false
    })
  },
  claer : function(){
    clearInterval(this.data.timer)
    this.data.timer = null

    clearInterval(this.data.totalTimeTimer)
    this.data.totalTimeTimer = null

    this.setData({
      answerTabClicked: -1,
      answerClicked: false,
      isChoiceCorrect: false,
      currentPage : 0,
      answerTitle : "",
      tick : 0,
      answeredQuestionId : []
    })
  },
  postResultToServer: function (result){
    let questionCatalogBriefData = app.getCurrentQuestionCatalogBriefData()
    let data = {
      user_id: 12360,
      qs_id: questionCatalogBriefData.qs_id,
      total_correct: this.data.currentPage + (result === false ? 0 : 1),
      used_time: this.data.totalTime,
      questions: this.data.answeredQuestionId
    }

    var that = this
    network.post(network.hostPostAnswerQuestion, data, res => {
      console.log("hostPostAnswerQuestion")
      console.log(res.data)
      that.setData({
        answerQuestionResponse: res.data
      })

      console.log(this.data.answerQuestionResponse)

    })
  }
})