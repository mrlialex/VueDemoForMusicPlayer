import jsonp from 'common/js/jsonp'
import { commonParams, options2 } from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options2)
}

export function getMusicList(id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid: id,
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
    type: 'top',
    page: 'detail',
    tpl: 3
  })

  return jsonp(url, data, options2)
}