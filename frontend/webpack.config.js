const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
  entry: {
		index: ["./src/index.js"],
  },
	plugins: [

    new HtmlWebpackPlugin({

      title: "Idea",
			template: "./src/index.html",

    }),

  ],

	devtool: "inline-source-map",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
		clean: true,
  },

  module: {

    rules: [

      {

        test: /\.css$/i,

        use: ["style-loader", "css-loader"],

      },
			{

        test: /\.(png|svg|jpg|jpeg|gif)$/i,

        type: "asset/resource",

      },
      { test: /\.(js|jsx)$/,
        
        exclude: /node_modules/,
        
        use: ["babel-loader"],
      },

    ],

  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  
  performance: {
    maxAssetSize: 800000,
    maxEntrypointSize: 800000,
  },
};
