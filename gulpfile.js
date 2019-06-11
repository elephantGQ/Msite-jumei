const { src, dest, series, parallel, watch } = require('gulp')
const path = require('path')
const gulpWebserver = require('gulp-webserver')
const proxy = require('http-proxy-middleware')
const gulpSass=require('gulp-sass')
const webpackStream=require('webpack-stream')
const del=require ('del')


  function copyhtml() {
    return src('./*.html')
      .pipe(dest('./dev'))
  }
  
  function copylibs() {
    return src('./src/libs/**/*')
      .pipe(dest('./dev/libs'))
  }
  
  function copyimages() {
    return src('./src/images/**/*')
      .pipe(dest('./dev/images'))
  }
  
  function copyicons() {
    return src('./src/icons/**/*')
      .pipe(dest('./dev/icons'))
  }
  function packjs() {
    return src('./src/**/*')
      .pipe(webpackStream({
        mode: 'development',
  
        entry: {
          app: ['./src/app.js'],
          detail: ['./src/detail.js'],
          search: ['./src/search.js'],
          searchResult: ['./src/searchResult.js'],
          
        },
  
        output: {
          filename: '[name].js',
          path: path.resolve(__dirname, './dev')
        },
  
        // 将ES6-ES8 代码转换成 ES5
        module: {
          rules: [
            {
              test: /\.js$/,
              // exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  plugins: [['@babel/plugin-transform-runtime', {
                    'helpers': false
                  }]]
                }
              }
            },
            {
              test: /\.html$/,
              loader: 'string-loader'
            }
          ]
        }
      }))
      .pipe(dest('./dev/scripts'))
  }
  
  function packCSS() {
    return src('./src/styles/*.scss')
      .pipe(gulpSass().on('error', gulpSass.logError))
      .pipe(dest('./dev/styles'))
  }
  
  function clear(target) {
    return function() {
      return del(target)
    }
  }
  
  function watcher() {
    watch('./src/libs/**/*', series(clear('./dev/libs'), copylibs))
    watch('./src/images/**/*', series(clear('./dev/images'), copyimages))
    watch('./src/icons/**/*', series(clear('./dev/icons'), copyicons))
    watch('./*.html', series(clear('./dev/*.html'), copyhtml))
    watch('./src/styles/**/*', series(packCSS))
    watch(['./src/**/*', '!src/libs/**/*', '!src/icons/**/*', '!src/images/**/*', '!src/styles/**/*'], series(packjs))
  }
function webserver() {
    return src('./dev')
      .pipe(gulpWebserver({
        host: 'localhost',
        port: 8000,
        livereload: true,
        middleware: [
          proxy('/home', {
            target: ' http://sh.jumei.com/Ajax/GetHomeTodayLists/200/1',
            changeOrigin: true, // 访问不同的域名，需要配置成 true
            pathRewrite: {
              '^/home': ''
            }
          }),
          proxy('/jumei', {
            target: ' http://h5.jumei.com',
            changeOrigin: true, // 访问不同的域名，需要配置成 true
            headers:{
              "Cookie":"guide_download_show=1; has_download=1; first_visit=1; "
            },
            pathRewrite: {
              '^/jumei': ''
            }
          }),
          proxy('/searchSuggest', {
            target: ' http://mobile.jumei.com',
            changeOrigin: true, // 访问不同的域名，需要配置成 true
            headers:{
              "Cookie":"guide_download_show=1; has_download=1; first_visit=1; "
            },
            pathRewrite: {
              '^/searchSuggest': ''
            }
          }),
          /*
          proxy('/staticDetail', {
            target: 'http://h5.jumei.com/product/ajaxStaticDetail',
            changeOrigin: true, // 访问不同的域名，需要配置成 true
            pathRewrite: {
              '^/staticDetail': ''
            }
          }),
          proxy('/dynamicDetail', {
            target: 'http://h5.jumei.com/product/ajaxDynamicDetail',
            changeOrigin: true, // 访问不同的域名，需要配置成 true
            pathRewrite: {
              '^/dynamicDetail': ''
            }
          }),
          proxy('/tuanInit', {
            target: 'http://s.h5.jumei.com/yiqituan/tab_list',
            changeOrigin: true, // 访问不同的域名，需要配置成 true
            pathRewrite: {
              '^/tuanInit': ''
            }
          }),
          proxy('/recommend', {
            target: 'http://h5.jumei.com/recommend/sale',
            changeOrigin: true, // 访问不同的域名，需要配置成 true
            pathRewrite: {
              '^/recommend': ''
            }
          })*/
        ]
      }))
  }
  exports.default = series(parallel(packCSS, packjs, copylibs, copyimages, copyicons), copyhtml, webserver, watcher)