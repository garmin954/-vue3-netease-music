const WorkboxPlugin = require("workbox-webpack-plugin");

const isProd = process.env.NODE_ENV === 'production'

// module.exports = {
//   outputDir: 'music',
//
//   configureWebpack: {
//     devtool: isProd ? false: 'source-map',
//     devServer: {
//       open: false, //浏览器自动打开页面
//       host: '0.0.0.0',
//       port: 8081,
//       https: false, // https: {type: boolean}
//       proxy: {
//         'api': {
//           target: 'http://api.pkus.net.cn/',
//           ws: true, //设置websocket
//           changeOrigin: true, // 设置跨域
//           pathRewrite: { //设置更改前缀
//             '^/api': ''
//           },
//           // secure: false,
//           // headers: {
//           //     Referer: process.env["VUE_APP_URL"]
//           // }
//
//         },
//       }
//     },
//
//     externals: isProd ? {
//       vue: 'Vue',
//       'vue-router': 'VueRouter',
//       vuex: 'Vuex',
//       axios: 'axios',
//     }: {},
//     plugins: [
//       new WorkboxPlugin.GenerateSW()
//     ]
//   },
//
//   css: {
//     // requireModuleExtension: false, // 开启CSS module
//     loaderOptions: {
//       sass: {
//         additionalData: `
//           @import "@/assets/style/variables.scss";
//           @import "@/assets/style/mixin.scss";
//         `,
//       },
//       // css: {
//       //   modules: {
//       //     localIdentName: '[name]-[hash]'
//       //   },
//       //   localsConvention: 'camelCaseOnly'
//       // }
//     },
//
//   },
//
//   pluginOptions: {
//     'style-resources-loader': {
//       preProcessor: 'sass',
//       patterns: []
//     }
//   },
//
// }



const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}


module.exports = {
  // mode: 'production',
  devServer: {
    hot:true,
    open: false, //浏览器自动打开页面
    host: '0.0.0.0',
    port: 8082,
    https: false, // https: {type: boolean}

    proxy: {
      'api': {
        target: 'http://api.pkus.net.cn/',
        ws: true, //设置websocket
        changeOrigin: true, // 设置跨域
        pathRewrite: { //设置更改前缀
          '^/api': ''
        },
        // secure: false,
        // headers: {
        //     Referer: process.env["VUE_APP_URL"]
        // }

      },
      '/foo': {
        target: '<other_url>'
      }
    }
  },



  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        additionalData: `
          @import "@/assets/style/variables.scss";
          @import "@/assets/style/mixin.scss";
        `,
      },

    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: []
    }
  },
};
