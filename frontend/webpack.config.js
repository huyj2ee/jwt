const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsChecker = require("fork-ts-checker-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const config = {
    devtool: isProduction ? false : "source-map",
    entry: "./src/index.tsx",
    output: {
      path: path.join(__dirname, "/build"),
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: { sourceMap: !isProduction }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: !isProduction }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"]
    },
    plugins: isProduction ?
    [
      new ForkTsChecker(),
      new HtmlWebpackPlugin({
        template: "./public/index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "public",
            to: ".",
            filter: (name) => {
              return !name.endsWith("index.html");
            }
          }
        ]
      })
    ] :
    [
      new ForkTsChecker(),
      new HtmlWebpackPlugin({
        template: "./public/index.html"
      })
    ]
  };
  return config;
};
