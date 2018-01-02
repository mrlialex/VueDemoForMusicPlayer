import * as types from './mutation-types.js'
import { playMode } from 'common/js/configSelf'
import { shuffle } from 'common/js/utilSelf'
import { saveSearch, deleteSearch, clearHistory, savePlay, saveFavorite, deleteFavorite } from 'common/js/cacheSelf'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export function selectPlay({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findIndex(list, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
}

export function randomPlay({ commit, state }, { list }) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
}
export function insertSong({ commit, state }, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // record current song
  let currentSong = playList[currentIndex]
  // 先插入，后删除
  // 列表内是否有song，如有返回其索引
  let fpIndex = findIndex(playList, song)
  // 插入这首歌到当前索引位置
  currentIndex++
  playList.splice(currentIndex, 0, song)
  // 如果已经包含这首歌
  if (fpIndex > -1) {
    // 插入的song在原先位置之后
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 插入的song在原先位置之前
      playList.splice(fpIndex + 1, 1)
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(currentSIndex, 1)
    }
  }
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
}

export function deleteSong({ commit, state }, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (!playList.length) {
    commit(types.SET_PLAYING, false)
  } else {
    commit(types.SET_PLAYING, true)
  }
}

export function deleteSongList({ commit }) {
  commit(types.SET_PLAYING, false)
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
}

export function saveSearchHistory({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export function deleteSearchHistory({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export function clearSearchHistory({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearHistory())
}

export function savePlayHistory({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export function saveFavoriteList({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export function deleteFavoriteList({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
