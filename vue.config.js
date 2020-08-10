module.exports = {
  configureWebpack: {
    externals: {
      //此处引号中的urlConfig必须和window.urlConfig一致
      BMap:
        "http://api.map.baidu.com/api?v=2.0&ak=nPLzTYCVl8nTAVPLgHXHfEDdieBTHSMY"
    }
  },
  devServer: {
    proxy: {
      "/place": {
        target: "http://api.map.baidu.com",
        ws: true,
        changeOrigin: true
      },
      "/geoconv": {
        target: "http://api.map.baidu.com",
        ws: true,
        changeOrigin: true
      }
    }
  }
};
