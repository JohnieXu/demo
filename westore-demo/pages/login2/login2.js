// pages/login2/login2.js
const userStore = require('../../stores/user_store')

Page({

  /**
   * 页面的初始数据
   */
  data: userStore.data,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userStore.bind(this)
    userStore.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleSaveTap() {
    userStore.handleSaveTap()
  },
  handleClearInput() {
    userStore.log.addLog('[bindinput] handleClearInput')
    userStore.changeName('')
  },
  handleInputChange(e) {
    userStore.handleInputChange(e.detail.value)
  }
})