let placeUrl = 'https://apis.map.qq.com/ws/place/v1/search?boundary=region({0},0)&keyword={1}&page_size=6&page_index=1&orderby=_distance&key=DCCBZ-C4UC5-A6JIY-QMNCW-A4Z6V-4CBLS'

let searchPlace = (placeName, region = '上海', cb_success, cb_failure) => {
  region=region||'上海';
  if (!cb_success)
    cb_success = resp => { console.log(resp); };

  if (!cb_failure)
    cb_failure = err => { console.error(err); };

  let url = placeUrl.replace('{0}', region).replace('{1}', placeName);
  console.log(url);
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'Accept': 'application/json',
    },
    success: cb_success,
    fail: cb_failure
  });
}

module.exports = {
  searchPlace
}