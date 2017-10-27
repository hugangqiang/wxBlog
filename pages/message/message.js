//获取应用实例

const app = getApp()
function delHtmlTag(str) {
  return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
}
function date(str) {
  let date = new Date(str);
  function p(s) {
    return s < 10 ? '0' + s : s;
  }
  return date.getFullYear() + '-' + p((date.getMonth() + 1)) + '-' + p(date.getDate()) + '  ' + p(date.getHours()) + ':' + p(date.getMinutes()) + ':' + p(date.getSeconds());
}
Page({
  data: {
    username: '',
    useremail: '',
    message: '',
    messages: {},
    alert: ''
  },
  onLoad: function (){
    wx.request({
      url: 'https://www.hugangqiang.com/api/message',
      method: 'GET',
      success: res => {
        let messages = res.data.data.reverse();
        for(let i=0; i<messages.length; i++){
          let text = messages[i].message;
          messages[i].message = delHtmlTag(text);
          let time = messages[i].addTime;
          messages[i].addTime = date(time);
          let str = messages[i].userImg;
          if ( str.substr(0, 4).toLowerCase() != 'http' ){
            messages[i].userImg = "https://www.hugangqiang.com" + messages[i].userImg;
          }
        }
        this.setData({
          messages: messages
        })
      }
    })
    
  },
  bindKeyName: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  bindKeyEmail: function (e) {
    this.setData({
      useremail: e.detail.value
    })
  },
  bindKeyMessage: function (e) {
    this.setData({
      message: e.detail.value
    })
  },
  tapSubmit: function(e) {
    let userName = this.data.username;
    let userEmail = this.data.useremail;
    let content = this.data.message;
    if (typeof (userName) != "undefined") {
      if (userName === '') {
        this.setData({
          alert: '用户名不能为空！'
        })
        return;
      }
      if (userEmail === '') {
        this.setData({
          alert: '邮箱不能为空！'
        })
        return;
      }
      let regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!regEmail.test(userEmail)) {
        this.setData({
          alert: '请输入正确的邮箱！'
        })
        return;
      }
    }

    if (content === '') {
      this.setData({
        alert: '内容不能为空！'
      })
      return;
    }
    this.setData({
      alert: ''
    })
    wx.request({
      url: 'https://www.hugangqiang.com/api/message',
      method: 'POST',
      data: {
        userName: userName,
        userEmail: userEmail,
        content: content,
        ip: {
          "cname": "小程序留言未开放地址",
          "cid": "000000",
          "cip": "0.0.0.0"
        }
      },
      success: res => {
        this.setData({
          username: '',
          useremail: '',
          message: ''
        })
        wx.request({
          url: 'https://www.hugangqiang.com/api/message',
          method: 'GET',
          success: res => {
            let messages = res.data.data.reverse();
            for (let i = 0; i < messages.length; i++) {
              let text = messages[i].message;
              messages[i].message = delHtmlTag(text);
              let time = messages[i].addTime;
              messages[i].addTime = date(time);
              let str = messages[i].userImg;
              if (str.substr(0, 4).toLowerCase() != 'http') {
                messages[i].userImg = "https://www.hugangqiang.com" + messages[i].userImg;
              }
            }
            this.setData({
              messages: messages
            })
          }
        })
      }
    })
  }
})