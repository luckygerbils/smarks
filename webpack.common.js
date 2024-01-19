/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, options) => {
  return {
    entry: {
      background: "./src/background.ts",
      newtab: "./src/newtab/index.tsx"
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: __dirname + "/dist",
    },
    optimization: {
      minimize: options.mode === "production",
    },
    experiments: {
      topLevelAwait: true,
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: "./src/newtab/newtab.html", force: true }
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "./src/manifest.json", force: true }
        ]
      })
    ],
    devtool: "cheap-module-source-map",
  };
}