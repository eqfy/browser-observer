const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const srcDir = path.join(__dirname, '..', 'src');

module.exports = {
    entry: {
        popup: path.join(srcDir, 'popup.tsx'),
        background: path.join(srcDir, 'background.ts'),
    },
    output: {
        path: path.join(__dirname, '../dist/js'),
        filename: '[name].js',
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'initial',
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.less$/i,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: '.', to: '../', context: 'public' }],
            options: {},
        }),
    ],
};
