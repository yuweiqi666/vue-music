/**
 *
 * @param {Array} data 接口返回的轮播图数据
 * @param {String} os 当前浏览器的类型
 * @returns 处理后的轮播图数据
 */
export var handleBannerImg = function (data, os) {
  const result = os === 'pc' ? (data.map(item => {
    return {
      ...item,
      pic: item.imageUrl
    }
  })) : data
  handleBannerImg = function () {
    return result
  }

  return handleBannerImg()
}
