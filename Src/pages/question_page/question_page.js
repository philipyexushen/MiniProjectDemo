const util = require('../../utils/util.js')
const network = require('../../network/requester.js')

Page({
  data: {
    backgroundImageWidth: 0,
    backgroundImageHeight: 0,
    backgroundSrc: '../images/question_page/background.png',
    answerTabBackgroundSrc: '../images/question_page/answer_tab_background.png',

    currentPage: 0,
    disccountList: [0.05, 0.08, 0.10, 0.15, 0.20, 0.30, 0.35, 0.40, 0.50, 1.00],
    problems: [{
      "q_id": 188,
      "qs_id": 1,
      "q_content": "图中是创造101 中最终第7位出道的女孩，她是?",
      //"q_pic": '../images/question_page/test_problem_pic.png',
      "q_pic": null,
      "options": [{
        "opt_id": 420,
        "opt_content": "赖美云",
        "opt_correct": 1,
        "cpt_pic": null
      }, {
        "opt_id": 421,
        "opt_content": "紫宁",
        "opt_correct": 0,
        "cpt_pic": null
      }, {
        "opt_id": 422,
        "opt_content": "杨芸晴",
        "opt_correct": 0,
        "cpt_pic": null
      }, {
        "opt_id": 423,
        "opt_content": "傅菁",
        "opt_correct": 0,
        "cpt_pic": null
      }]
    },
      {
        "q_id": 189,
        "qs_id": 1,
        "q_content": "女孩，她是?",
        "q_pic": '../images/question_page/test_problem_pic.png',
        "options": [{
          "opt_id": 420,
          "opt_content": "A",
          "opt_correct": 1,
          "cpt_pic": null
        }, {
          "opt_id": 421,
          "opt_content": "B",
          "opt_correct": 0,
          "cpt_pic": null
        }, {
          "opt_id": 422,
          "opt_content": "C",
          "opt_correct": 0,
          "cpt_pic": null
        }, {
          "opt_id": 423,
          "opt_content": "22423432",
          "opt_correct": 0,
          "cpt_pic": null
        }]
      }
    ],

    tick: 10,
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
    titleThirdLineOriginal: "获得一张%s点赞优惠券",

    titleFirstLine: "",
    titleSecondLine: "",
    titleThirdLine: "",

    fakeRank : [10,15,20,25,30,50,60,80,90,99]
  },
  backgroundImageLoad: function (e) {
    var imageSize = util.imageResize(e);
    this.setData({
      backgroundImageWidth: imageSize.imageWidth,
      backgroundImageHeight: imageSize.imageHeight
    })
  },
  onLoad: function (e) {
    console.log("onShow question_page");
    var that = this
    this.resetTimer()
    this.setNewTitle(1)

    let data = { user_id: 1, qs_name: "test" }
    //let data1 = { number: 4, qs_id: 1 }
    console.log(network.hostGetQuestion)
    network.post(network.hostGetQuestion, data, res => {
      that.setData({
        problems: res.data
      })
    })

    wx.showShareMenu({
      withShareTicket: true
    })
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

      if (this.data.answerTabClicked == this.data.answerCorrect){
        this.data.isChoiceCorrect = true
        var that = this
        this.data.isChoiceCorrect = true
        setTimeout(() => {
          that.onSuccessful(that)
        }, 1000)
      }else{
        var that = this
        this.data.isChoiceCorrect = false
        setTimeout(()=>{
          that.onError()
        }, 1000)
      }

      clearInterval(this.data.timer)
    }
  },
  onError: function (){
    console.log("no!")
    this.setData({
      titleFirstLine: this.data.titleFirstLineOriginal.replace("%s", this.data.currentPage + 1),
      titleSecondLine: this.data.titleSecondLineOriginal.replace("%s", this.data.fakeRank[this.data.currentPage]),
      titleThirdLine: this.data.titleThirdLineOriginal.replace("%s", "创造101"),
      showResultPageDialog : true
    })
  },
  onSuccessful: function (that){
    // 全答对了！
    if (that.data.currentPage + 1 == that.data.problems.length){

      return
    }

    that.setData({
      currentPage: that.data.currentPage + 1
    })

    that.setNewTitle(that.data.currentPage + 1)

    var options = that.data.problems[that.data.currentPage].options
    var total = options.length

    console.log(total)
    for (var index = 0; index < total;index++){
      if (options[index].opt_correct == 1){
          this.setData({
            answerCorrect: index
          })
          break
      }
    }
    that.setData({
      answerTabClicked: -1,
      answerClicked: false,
      isChoiceCorrect: false
    })

    that.resetTimer()
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

        this.onError()
      }
    }, 1000)
  },
  onResultPageDialogCloseButtonClicked : function(e){
    // TODO: 要改为跳转到排行榜
    wx.navigateBack({delta : 1})
  },
  onGiftRollImageClicked: function (e) {
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
  claer : function(){
    clearInterval(this.data.timer)
    this.data.timer = null
    this.setData({
      answerTabClicked: -1,
      answerClicked: false,
      isChoiceCorrect: false,
      currentPage : 0,
      answerTitle : "",
      tick : 0,
    })
  }
})