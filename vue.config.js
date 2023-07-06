const { defineConfig } = require('@vue/cli-service');
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
const zlib = require('zlib');
const { resolve } = require('path');
module.exports = defineConfig({
  publicPath: '/',
  lintOnSave: true,
  productionSourceMap: !IS_PROD,
  //为 sass 提供全局样式，以及全局变量
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass')
      },
      scss: {
        additionalData: `@use "./src/theme-chalk/global.scss" as *;`
      }
    }
  },
  configureWebpack: (config) => {
    let plugins = [
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
            exclude: new RegExp(/^(?!.*loading-directive).*$/)
          })
        ]
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
      })
    ];
    if (IS_PROD) {
      config.optimization = {
        //单独打包第三方模块
        splitChunks: {
          cacheGroups: {
            common: {
              name: 'chunk-common',
              chunks: 'initial',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 1,
              reuseExistingChunk: true,
              enforce: true
            },
            vendors: {
              name: 'chunk-vendors',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'initial',
              priority: 2,
              reuseExistingChunk: true,
              enforce: true
            },
            elementUI: {
              name: 'chunk-elementui',
              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              chunks: 'all',
              priority: 3,
              reuseExistingChunk: true,
              enforce: true
            },
            echarts: {
              name: 'chunk-echarts',
              test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
              chunks: 'all',
              priority: 4,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      };
      //需要后端配置nginx
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path][base].br',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: true
        })
      );
    }
    config.plugins = [...config.plugins, ...plugins];
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'DADP微服务快速开发平台';
      return args;
    });
    config.resolve.symlinks(true);
    if (IS_PROD) {
      // 压缩图片
      config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: false },
          pngquant: { quality: [0.65, 0.9], speed: 4 },
          gifsicle: { interlaced: false }
        });
    }
    //使用svg组件
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule.exclude.add(/node_modules/);
    svgRule.exclude.add(resolve('src/assets/svg')).end();
    //svg/app 手动引入
    config.module.rule('app').exclude.add(resolve('src/assets/svg/app')).end();
    //svg/icon：自动引入的svg图标<v-svg-icon iconName=“#icon-文件名” />
    config.module
      .rule('icon')
      .include.add(resolve('src/assets/svg/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
    const imagesRule = config.module.rule('images');
    imagesRule.exclude.add(resolve('src/assets/svg/icon'));
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);

    if (IS_PROD) {
      // 打包分析
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ]);
    }
  }
});
