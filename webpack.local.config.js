import path from "path";
import webpack from "webpack";
import BundleTracker from "webpack-bundle-tracker";


const config = {
  devtool: "cheap-module-eval-source-map",
  entry: [
    "webpack-dev-server/client?http://localhost:3000",
    "font-awesome/scss/font-awesome.scss",
    "webpack/hot/only-dev-server",
    "./Origami/src/index"
  ],
  devServer: {
    inline: true,
    hot: true,
    headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*'
    }

  },
  target: "web",
  output: {
    path: path.resolve("./django_server/static/bundles/"),
    publicPath: "http://localhost:3000/static/bundles/",
    filename: "bundle.js"
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new BundleTracker({ filename: "./webpack-stats-local.json" })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "Origami"),
        loader: "babel-loader"
      },
      { test: /jquery\.js$/, loader: "expose-loader?jQuery!expose-loader?$" },
      {
        test: /\.(s*)css$/,
        use: ['style-loader','css-loader', 'sass-loader']
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml"
      },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.(jpe?g|png|gif)$/i, loader: "file-loader?name=[name].[ext]" }
    ]
  }
};

module.exports = config;
