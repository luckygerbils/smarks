/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const CopyWebpackPlugin = require("copy-webpack-plugin");
const child_process = require("child_process");

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
        {

        }
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
          { 
            from: "./src/manifest.json", 
            force: true, 
            transform: buffer => {
              const commitHash = child_process.execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
              return new TextDecoder().decode(buffer).replace(/\$COMMIT_HASH/, commitHash);
            }
          }
        ],
      })
    ],
    devtool: "cheap-module-source-map",
  };
}