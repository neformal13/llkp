const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = [
{
    name: "backend",
    target: "node",

    externals: [nodeExternals({
        whitelist: [/.css$/],
    })],

    entry: {
        backend: './src/backend'
    },
    output: {
        path: './build',
        filename: '[name].js',
        libraryTarget: "commonjs"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                loader: 'ignore-loader'
            }
        ]
    },
},
{
    name: "frontend",
    entry: {
        frontend: './src/frontend',

    },
    output: {
        path: './build',
        filename: '[name].js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallbackLoader: "style-loader",
                loader: "css-loader"
            }) }
        ]
    },

    plugins: [
        new ExtractTextPlugin("styles.css")
    ]

}
];

if (NODE_ENV === "production") {
    let frontend = module.exports[1];
    frontend.entry.frontend = ["babel-polyfill","./src/app.frontend.js"];

    frontend.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings : false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}
