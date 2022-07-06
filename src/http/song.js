import { request } from '@/utils/request.js'

// 获取歌手歌单
export const getMusicListApi = (params) => {
  return request({
    url: '/artist/songs',
    params
  })
}

// 获取歌曲详情  (图片)
export const getMusicDetailApi = (params) => {
  return request({
    url: '/song/detail',
    params
  })
}

// 获取歌曲歌词
export const getMusicLyricApi = (params) => {
  return request({
    url: '/lyric',
    params
  })
}

// 获取歌曲url
export const getMusicUrlApi = (params) => {
  return request({
    url: '/song/url',
    params
  })
}
