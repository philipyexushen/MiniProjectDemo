//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    backgroundImageWidth: 0,
    backgroundImageHeight: 0,
    backgroundSrc: '../images/question_page/background.png',

    currentPage : 0,
    disccountList: [0.05, 0.08, 0.10, 0.15, 0.20, 0.30, 0.35, 0.50, 0.70, 0.90],
    problems: [{
        "q_id": 188,
        "qs_id": 1,
        "q_content": "图中是创造101 中最终第7位出道的女孩，她是?",
        "q_pic": null,
        "options": [{
          "opt_id": 420,
          "opt_content": "赖美云",
          "opt_correct": 1,
          "cpt_pic": null
          },{
            "opt_id": 421,
            "opt_content": "紫宁",
            "opt_correct": 0,
            "cpt_pic": null
            },{
            "opt_id": 422,
            "opt_content": "杨芸晴",
            "opt_correct": 0,
            "cpt_pic": null
            },{
            "opt_id": 423,
            "opt_content": "傅菁",
            "opt_correct": 0,
            "cpt_pic": null
            }]
      }
    ],

    tick : 10,
    timer : null,
    
    answer_title: "-这是第%s题-"
  },
  backgroundImageLoad: function (e) {
    var imageSize = util.imageResize(e);
    this.setData({
      backgroundImageWidth: imageSize.imageWidth,
      backgroundImageHeight: imageSize.imageHeight
    })
  },
  onShow : function(e){
    console.log("onShow question_page");

    var that = this
    this.data.timer = setInterval(()=>{
      console.log("timeout! " + that.data.tick)
      that.setData({
        tick: that.data.tick - 1
      })
      if (that.data.tick == 0){
        clearInterval(that.data.timer)
        that.data.timer = null
      }
    }, 1000)

  },
  onHide : function(e){
    clearInterval(this.data.timer)
    this.data.timer = null
  }
})
