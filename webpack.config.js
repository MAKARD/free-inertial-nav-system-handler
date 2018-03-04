// tslint:disable
const path = require("path");
const webpack = require("webpack");

const CriticalPlugin = require("webpack-plugin-critical").CriticalPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const debug = process.env.NODE_ENV !== "prod";
console.log(`Running in ${process.env.NODE_ENV} environment`);

const babelEnvLoaderPlugins = [
    "transform-object-rest-spread",
    "syntax-dynamic-import",
    "transform-class-properties",
    "transform-regenerator",
    ["transform-runtime", {
        polyfill: false,
        regenerator: true,
    }],
];

const config = {
    entry: [
        "babel-regenerator-runtime",
        "./src/renderer/index.tsx"
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: "./renderer",
        host: "localhost",
        publicPath: "/",
        noInfo: false,
        inline: true,
        port: 8089,
        hot: true,
        stats: {
            colors: true
        }
    },
    output: {
        filename: "[name].[hash:6].js",
        path: path.resolve("./build/renderer"),
        publicPath: "./",
    },

    devtool: debug ? "source-map" : false,

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".jsx", ".css",],
        modules: [
            path.resolve("node_modules"),
            path.resolve("src"),
        ],
        alias: {
            normalize: path.join(__dirname, "/node_modules/normalize.css"),
        }
    },

    module: {
        loaders: [
            {
                test: /\.(css|scss)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: debug,
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: function (loader) {
                                    const plugins = [
                                        require("autoprefixer")({ remove: false }),
                                    ];
                                    if (!debug) {
                                        plugins.push(require("cssnano")());
                                    }
                                    return plugins;
                                },
                                sourceMap: debug,
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                includePaths: [
                                    path.resolve(__dirname + "./styles"),
                                    path.resolve(__dirname, "./node_modules/compass-mixins/lib"),
                                ],
                            },
                        },
                    ],
                }),
            },
            {
                test: /\.woff2?$|\.ttf$|\.eot$|\.otf$/,
                loaders: [
                    {
                        loader: "file-loader",
                        query: {
                            name: "[name].[hash:6].[ext]",
                        },
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                loaders: [
                    {
                        loader: "babel-loader",
                        query: {
                            presets: [
                                "react",
                                ["env", {
                                    "targets": {
                                        "node": "current",
                                    },
                                    "useBuiltIns": true
                                }],
                            ],
                            "plugins": babelEnvLoaderPlugins
                        },
                    },
                    "awesome-typescript-loader",
                ],
            },
            {
                test: /\.jsx?$/,
                exclude:
                    [/node_modules/],
                loader: "babel-loader",
                query: {
                    presets: [
                        "react",
                        ["env", {
                            "targets": {
                                "node": "current",
                            },
                            "useBuiltIns": true
                        }]
                    ],
                    "plugins": babelEnvLoaderPlugins
                },
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
        ],
    },

    plugins: [
        new webpack.NodeEnvironmentPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            },
        }),
        new ExtractTextPlugin({
            filename: "styles.[hash:6].css",
            publicPath: "/",
        }),
        new webpack.IgnorePlugin(/caniuse-lite\/data\/regions/),
        new HtmlWebpackPlugin({
            title: "Electron app",
            template: path.resolve('./templates/index.ejs'),
            minify: {
                minifyCSS: !debug,
                minifyJS: !debug,
                removeComments: !debug,
                trimCustomFragments: !debug,
                collapseWhitespace: !debug,
            }
        })
    ]
};

const imagesLoaders = [
    {
        loader: "file-loader",
        query: {
            name: "[name].[hash:6].[ext]",
        },
    },
];

if (debug) {
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
} else {
    config.plugins.push(
        new CleanWebpackPlugin([path.resolve("./build")]),
        new UglifyJsPlugin({
            parallel: true,
            cache: true,
            uglifyOptions: {
                ie8: false,
                ecma: 8,
                output: {
                    comments: false,
                    beautify: false,
                },
                compress: true,
                warnings: false
            }
        }),
        new CriticalPlugin({
            src: "index.html",
            inline: true,
            minify: true,
            dest: "index.html"
        })
    );
    imagesLoaders.push(
        {
            loader: "image-webpack-loader",
            query: {
                mozjpeg: {
                    progressive: true,
                },
                gifsicle: {
                    interlaced: false,
                },
                optipng: {
                    optimizationLevel: 4,
                },
                svgo: {
                    removeEmptyAttrs: true,
                    moveElemsAttrsToGroup: true,
                    collapseGroups: true,
                    convertStyleToAttrs: true,
                    cleanupIDs: true,
                    minifyStyles: true,
                    cleanupAttrs: true,
                },
                pngquant: {
                    quality: "75-90",
                    speed: 3,
                },
            },
        }
    );
}

config.module.loaders.push(
    {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loaders: imagesLoaders,
    }
);

module.exports = config;