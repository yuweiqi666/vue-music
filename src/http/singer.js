import { localRequest } from '@/utils/request.js'

// 获取本地json歌手数据
export const getSingerListApi = () => {
  return localRequest('/mock/singer.json')
}
