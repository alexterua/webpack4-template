const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const pug = require('./webpack/pug');
const devserver = require('./webpack/devserver');
const sass = require('./webpack/sass');
const css = require('./webpack/css');
const extractCSS = require('./webpack/css.extract');

const PATHS = {
  source: path.join(__dirname, 'source'),
  build: path.join(__dirname, 'build')
};

const common = merge([
  {
    entry: {
      'index': PATHS.source + '/pages/index/index.js',
      'blog': PATHS.source + '/pages/blog/blog.js'
    },
    // splitChunksPlugin вместо CommonsChunkPlugin
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: "common",
            chunks: "initial"
          }
        }
      }
    },
    
    output: {
      path: PATHS.build,
      filename: 'js/[name].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        chunks: ['index', 'common'],
        template: PATHS.source + '/pages/index/index.pug'
      }),
      new HtmlWebpackPlugin({
        filename: 'blog.html',
        chunks: ['blog', 'common'],
        template: PATHS.source + '/pages/blog/blog.pug'
      }),
      /*new webpack.optimize.CommonsChunkPlugin({
        name: 'common'
      })*/    
        
      
    ]
  },
  pug()  
]);

module.exports = function(env) {
  if(env === 'production') {
    return merge([
      common,
      extractCSS()
    ]);
  }
  if(env === 'development') {
    return merge([
      common,
      devserver(),
      sass(),
      css()
    ])
  }
};