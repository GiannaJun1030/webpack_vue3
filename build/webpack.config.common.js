const { VueLoaderPlugin } = require('vue-loader/dist/index');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');

const { resolve } = require('path');
const __root = resolve(__dirname, '../');
const { name, version } = require('../package.json');

const vueRules = [
  {
    test: /\.vue$/i,
    use: ['vue-loader'],
  },
];
const resRules = [
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
  },
];
const babelRules = [
  {
    test: /\.(t|j)s$/,
    exclude: /(node_modules|bower_components)/,
    use: ['babel-loader'],
  },
];
module.exports = {
  entry: {
    index: './src/main',
  },
  output: {
    publicPath: '/',
    path: resolve(__root, 'dist'),
    clean: true,
    filename: '[name].bundle.[contenthash:8].js',
    assetModuleFilename: 'assets/[name].[hash][ext][query]',
    library: {
      name: `${name}@${version}`,
      type: 'umd',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__root, 'src'),
    },
    extensions: ['.vue', '.ts', '.js', '.json', 'scss', 'css'],
  },
  module: {
    rules: [...resRules, ...babelRules, ...vueRules],
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      templateParameters: {
        title: name,
      },
    }),
    new WebpackBar({
      color: '#a76933',
    }),
  ],
};