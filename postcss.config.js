module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*', '!font*', '!border*'],
      exclude: /node_modules/i
    }
  }
}
