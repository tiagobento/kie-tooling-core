const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        standalone: './src/standalone.js'
    },
    output: {
        filename: 'monaco.min.js',
        path: path.resolve(__dirname, 'dist/standalone')
    },
    module: {
        rules: [
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
