import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteItemFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => { return item === query }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function savePlay(song) {
  let plays = storage.get(PLAY_KEY, [])
  insertArray(plays, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, plays)
  return plays
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteItemFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearHistory() {
  storage.remove(SEARCH_KEY)
  return []
}

export function saveFavorite(song) {
  let searches = storage.get(FAVORITE_KEY, [])
  insertArray(searches, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, searches)
  return searches
}

export function deleteFavorite(song) {
  let searches = storage.get(FAVORITE_KEY, [])
  deleteItemFromArray(searches, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, searches)
  return searches
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
