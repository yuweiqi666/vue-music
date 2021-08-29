import request from '@/utils/request.js'

// 获取首页轮播图
export const getBannerApi = (params) => {
  return request('/banner', {
    params
  })
}
