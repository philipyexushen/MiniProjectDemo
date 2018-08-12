// 基础配置类

function request(data, func) {
  let _config = {
    host: 'http://118.25.208.124:5001/api/getquestion'
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
  console.log(data.url)
  return data.url = url, data;
}

function post(data, func) {
  return request(get_api_setting('', data), func);
}

module.exports = {
  post: post
}