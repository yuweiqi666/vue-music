import { request } from '@/utils/request.js'

// 获取歌曲榜单
export const getSongRankListApi = () => {
  return request('/toplist/detail')
}
