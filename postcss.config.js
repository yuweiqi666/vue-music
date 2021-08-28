module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*', '!font*'],
      exclude: /node_modules/i
    }
  }
}
