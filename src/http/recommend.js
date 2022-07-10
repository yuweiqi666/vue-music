import { request } from '@/utils/request.js'

// 获取首页轮播图
export const getBannerApi = params => {
  return request('/banner', {
    params
  })
}

// 获取热门歌单
export const getHotListApi = () => {
  return request('/personalized')
}

// 获取歌单详情
export const getSongListDetailApi = params => {
  return request('/playlist/detail', {
    params
  })
}
