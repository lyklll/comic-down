module.exports = {
    devServer: {
        port: 8080,
        host: '127.0.0.1',
        disableHostCheck: true,
        proxy: {
            '/apis': {
                // 测试环境
                target: "http://127.0.0.1:3000/", // 接口域名
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/apis': '' //需要rewrite重写的,
                }
            }
        },
    },
    configureWebpack: {
        performance: {
            hints: false
        }
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                win: {
                    icon: './public/app.ico'
                },
                mac: {
                    icon: './public/app.png'
                }
            }
        }
    }
}