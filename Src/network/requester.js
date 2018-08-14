// 基础配置类
let hostGetQuestion = 'https://www.defphilip.com/api/getquestion'
let hostGetGoods = 'https://www.defphilip.com/api/getgoods'
let hostGetQs = 'https://www.defphilip.com/api/getqs'
let hostPostAnswerQuestion = 'https://www.defphilip.com/api/answerquestion'

function request(host, data, func) {
  let _config = {
    host: host
  }

  let url = data.url;
  delete data.url;
  wx.request({
    url: _config.host + url,
    data: data,
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: (res) => {
      func(res);
    }
  });
  return;
}

function get_api_setting(url, data) {
  console.log(url)
  console.log(data)
  return data.url = url, data;
}

function post(host, data, func) {
  return request(host, get_api_setting('', data), func);
}

module.exports = {
  post: post,
  hostGetQuestion: hostGetQuestion,
  hostGetGoods: hostGetGoods,
  hostGetQs: hostGetQs,
  hostPostAnswerQuestion: hostPostAnswerQuestion
}