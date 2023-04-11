const prod = process.env.NODE_ENV === "production";
const github = process.env.NODE_ENV === "github";
//
// pwa config
// https://cli.vuejs.org/core-plugins/pwa.html#configuration
module.exports = {
  publicPath : github? '/MILID': (prod? '/':'/'),
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:4000',
        changeOrigin: true, // so CORS doesn't bite us.
      }
    }
  },
  pwa:{
    name:"MIDARE",
    themeColor:"#0061d4",
    appleMobileWebAppCapable: true,
    appleMobileWebAppStatusBarStyle:'#0061d4',
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      exclude: [/.mp3$/,/.json$/] // removes mp3 files from precache manifest
      // swSrc is required in InjectManifest mode.
      // swSrc: 'dev/sw.js',
      // ...other Workbox options...
    },
    manifestOptions: {
      background_color: "#0061d4"
    }

  }
}
