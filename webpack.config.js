const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        "monaco.min": './src/monaco.min.ts'
    },
    output: {
        libraryTarget: "commonjs2",
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/standalone')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.ttf$/,
                use: ["null-loader"],
            }
        ]
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ]
};
