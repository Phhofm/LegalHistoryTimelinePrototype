const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',                          // loads TerserPlugin, configures DefinePlugin  -> 1.1MB
    plugins: [
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', {
                    discardComments: {
                        removeAll: true
                    }
                }],
            },
            canPrint: true
        }),
    ],
    optimization: {
        moduleIds: 'hashed',
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,                // Must be set to true if using source-maps in production
                terserOptions: {
                    toplevel: true,
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    }
});