export function shuffle(list) {
  let _arr = list.slice()
  for (let i = 0; i < list.length; i++) {
    let j = randomNum(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    } else {
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }
}
