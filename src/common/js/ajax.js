import axios from 'axios'

export default function ajax(url, data) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  axios.get(url).then((res) => {
    return res
  }).catch((err) => {
    console.log(err)
  })
}

export function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}
