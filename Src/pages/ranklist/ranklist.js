//ranklist.js
//获取应用实例
const parseQsallData = function (data) {
  return data.map(e => {
    return {
      id: e.qs_id,
      name: e.qs_title
    }
  })
}

const parseToplistData = function(data) {
  return data.map(e => {
    return {
      "avatar": e.user_pic,
      "usedtime": e.used_time,
      "numOfCorrection": e.correct_nb,
      "nickname": e.nickname,
    }
  })
}
const parseMyrankData = function(data) {
  return {
      "rank": data.row,
      "usedtime": data.used_time,
      "numOfCorrection": data.correct_nb,
      "nickname": data.nickname,
    }
}

const app = getApp()

const config = {
  avatarDefault: "../../images/RankPageImage/avatar-default.png"
}
Page({
  data: {
    user_id: 12345,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarDefault: config.avatarDefault,
    NavTableScorell : 0,
    currentTabIdx : 0,
    currentTabName: "",
    QsQueq : { id : 0, name : ''},
    currentMyRankInfo: {hasData: false },
    currentRanklist: { hasData : false},
    clientWidth: app.globalData.clientWidth,
    clientHeight: app.globalData.clientHeight,
    model : app.globalData.model
  },
  dbTest: "http://" + app.globalData.dbConfig.host + ":" + app.globalData.dbConfig.port,
  //事件处理函数
  initData : function() {
    var that = this;
    this.getQsQueq(function(QsQueq, error){
      if(!error) {
        that.setData({
          QsQueq : QsQueq,
          ranklistData: QsQueq.map(e => {hasData : false}),
          myRankInfoData: QsQueq.map(e => {hasData : false})
        })
        QsQueq.forEach(function(qs) {
          that.getMyRankInfoData(qs, that.data.user_id, function (myRankInfo, err) {
            that.addMyRankInfoData(myRankInfo)
          })
        })
        that.setCurrentTableIdx(that.data.currentTabIdx)
      }
    })
    console.log(that.data)
  },
  getQsQueq : function(callback) {
    wx.request({
      url: this.dbTest + "/api/getqsall",
      data: {"desc" : "get tablelist"},
      header: {
        'content-type': 'application/json' // 默认值
      },
      dataType : "json",
      method : "POST",
      complete : function (res) {
        var QsQueq = parseQsallData(res.data);
        if(QsQueq) {
          callback(QsQueq, false);
        }
      }
    })
  }, 
  getMyRankInfoData: function (qs, userId, callback) {
    wx.request({
      url: this.dbTest + "/api/getmyrank",
      data: { "qs_id": qs.id, "user_id" : userId},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        var myRankInfo = {
          name : qs,
          data : parseMyrankData(res.data)
        }
        if (myRankInfo) {
          callback(myRankInfo, false);
        }
      }
    })
  },
  addMyRankInfoData : function(myRankInfo) {
    var tableIdx = this.data.QsQueq.map(e => e.id).indexOf(myRankInfo.name.id);
    if (tableIdx != -1 && tableIdx < this.data.myRankInfoData.length) {
      var dataObj = new Object();
      dataObj["myRankInfoData[" + tableIdx + "].data"] = myRankInfo.data;
      dataObj["myRankInfoData[" + tableIdx + "].hasData"] = true;
      dataObj["myRankInfoData[" + tableIdx + "].isEmpty"] = myRankInfo.data.rank == undefined;
      this.setData(dataObj);
    }

  },
  getRankListData : function(qs, callback) {
    wx.request({
      url: this.dbTest + '/api/gettoplist',
      data: {
        qs_id: qs.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      success: function (res) {
        console.log("gettoplist:", res)
        var ranklist = {
          'name': qs,
          'data': parseToplistData(res.data)
        }
        if (ranklist) {
          callback(ranklist, false);
        }
      }
    })
  },
  addRanklistData: function (ranklist) {
    var tableIdx = this.data.QsQueq.map(e => e.id).indexOf(ranklist.name.id);
    if (tableIdx != -1 && tableIdx < this.data.ranklistData.length) {
      var dataObj = new Object();
      dataObj["ranklistData[" + tableIdx + "].data"] = ranklist.data;
      dataObj["ranklistData[" + tableIdx + "].hasData"] = true;
      this.setData(dataObj);
    }  
  },
  setCurrentTableIdx: function (currentTabIdx) {
    var that = this;
    var currentTabName = that.data.QsQueq[currentTabIdx];

    if (!(that.data.ranklistData && that.data.ranklistData[currentTabIdx])) {
      console.log("request data : ")
      that.getRankListData(currentTabName, function (ranklist, error) {
        if (!error) {
          that.addRanklistData(ranklist);
          that.setData({
            currentTabIdx: currentTabIdx,
            currentTabName: currentTabName,
            currentMyRankInfo: that.data.myRankInfoData[currentTabIdx] || { hasData: false },
            currentRanklist: that.data.ranklistData[currentTabIdx] || { hasData: false },
          })
        }
      })
    }
    console.log(" data : ", this.data)
    that.setData({
      currentTabIdx: currentTabIdx,
      currentTabName: currentTabName,
      currentMyRankInfo: that.data.myRankInfoData[currentTabIdx] || {hasData : false},
      currentRanklist: that.data.ranklistData[currentTabIdx] || {hasData : false},
    })
  },
  onLoad: function () {
    wx.getUserInfo({
      
    })
    this.initData();
    var that = this;
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '答题赢周边',
      path: '/pages/ranklist/ranklist',
      success : function(res) {
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) {
            console.log(res)
          },
          fail : function(res) {
            console.log(res)
          }
        })
      }
    }
  },
  tapNavTable : function(e) {
    var currentTabIdx = e.currentTarget.dataset.tabIdx;
    if (currentTabIdx != this.data.currentTabIdx)
      this.setCurrentTableIdx(currentTabIdx);
  },
  swichNavTab : function(e) {
    var that = this;
    if (e.detail.current == that.data.currentTabIdx) return;
    var currentTabIdx = e.detail.current;
    that.setCurrentTableIdx(currentTabIdx);
    var query = wx.createSelectorQuery()
    query.select('#NavTable-' + that.data.currentTabIdx).boundingClientRect()
    query.exec(function (res) {
      if (res.lenfth < 0) return;
      var loc = (res[0].left + res[0].right) / 2;
      var mid = app.globalData.clientWidth/ 2 || 150;
      var maxScroll = app.globalData.clientWidth * 0.8;
      var scroll = mid- loc;
      that.setData({
        NavTableScorell: Math.min(maxScroll, Math.max(0, that.data.NavTableScorell - scroll))
      })
    })
  },
  tabNavButton : function(e) {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  avatarError : function(e) {
    var avatarIdx = e.currentTarget.dataset.avatarIdx;
    var dataObj = new Object();
    dataObj["currentRanklist.data[" + avatarIdx + "].avatar"] = "default";
    this.setData(dataObj);
  }
})