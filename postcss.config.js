module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*', '!border*'],
      exclude: /node_modules/i
    }
  }
}
