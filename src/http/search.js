import { request } from '@/utils/request.js'

// 获取热门搜索
export const getHotSearchApi = () => {
  return request('/search/hot')
}

// 关键词搜索
export const getKwSearchApi = (params) => {
  return request('/cloudsearch', {
    params
  })
}
