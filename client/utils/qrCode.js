//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET


let getAccessToken = (cb_success, cb_failure) => {
  // console.log('storage => update data');
  let url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx65c33dab465989c4&secret=056cb6850f93278dd35f930ca344714f";
  if (!cb_success)
    cb_success = resp => { console.log(resp); };
  if (!cb_failure)
    cb_failure = err => { console.error(err); };
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    success: cb_success,
    fail: cb_failure
  });
}


module.exports = {
  getAccessToken
}