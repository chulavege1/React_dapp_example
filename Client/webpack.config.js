const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: [
    './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/index.js'
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
  },
  node: {
    fs: "empty"
  },
//   optimization: {
//     sideEffects: false,// <----- in production defaults to true if left blank
// },

  resolve: {
    alias: {
        '~': path.resolve(__dirname, 'src/Root'),
        '~Client': path.resolve(__dirname, 'src/Root/Components/Client'),
        '~CSS': path.resolve(__dirname, 'src/CSSModule'),
        '~PREF': path.resolve(__dirname, 'src/Preference'),
        '~Redux': path.resolve(__dirname, 'src/Root/Redux'),
        '~Abi': path.resolve(__dirname, 'src/Abi'),
    }
},
  devtool: "source-map",
    module: {
      rules: [
        {
          rules:[{ test: /\.tsx?$/, loader: 'awesome-typescript-loader' }], // other loader configuration goes in the array
          resolve: {extensions: ['.js', '.jsx', '.react.js', '.ts', '.tsx']},
        },
        {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      
      {
        test: /\.sass|scss|css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },

      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts'
            }
          }
        ]
      },

      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img'
            },
          },
        ],
      },

      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },

      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      ]
    },

    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      }),
      new ExtractTextPlugin("style.css")
    ]
  };
