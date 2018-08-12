// pages/outsideLink/outsideWebkit.js
const util = require('../../utils/util.js')

Page({
  /**
   * 组件的初始数据
   */
  data: {
    link : ""
  },

  onShow : function(){
    this.setData({
      link: util.getOutSideLink()
    })
  },
})
