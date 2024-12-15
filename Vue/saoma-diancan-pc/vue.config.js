module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '/merchant': {
        target: 'http://localhost:80',
        changeOrigin: true
      },
      '/admin': {
        target: 'http://localhost:80',
        changeOrigin: true
      }
    }
  }
}