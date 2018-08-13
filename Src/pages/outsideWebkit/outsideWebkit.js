// pages/outsideLink/outsideWebkit.js
const util = require('../../utils/util.js')

Page({
  /**
   * 组件的初始数据
   */
  data: {
    link : ""
  },

  onLoad : function(opt){
    this.setData({
      link: opt.url
    })
  },
})
