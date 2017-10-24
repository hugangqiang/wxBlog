let WxParse = require('../../wxParse/wxParse.js');

function date(str) {
  let date = new Date(str);
  function p(s) {
    return s < 10 ? '0' + s : s;
  }
  return p((date.getMonth() + 1)) + '.' + p(date.getDate())
}
//获取应用实例
const app = getApp()

Page({
  data: {
    contents: {}
  },
  onLoad(){
    let that = this;
    let getCurrentArr = getCurrentPages();
    let contents = getCurrentArr[0].data.contents;
    let id = getCurrentArr[1].options.id;
    for(let i=0;i<contents.length; i++){
      if(id === contents[i]._id){
        let conObj = contents[i];
        conObj.addTime = date(conObj.addTime);
        this.setData({
          contents: conObj
        })
      }
    }
    WxParse.wxParse("article", "html", that.data.contents.content, that, 5)
  }
})