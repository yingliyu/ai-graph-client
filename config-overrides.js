const {
    override,
    fixBabelImports,
    addLessLoader,
    useEslintRc,
    addWebpackAlias
} = require('customize-cra');

const path = require('path');
function resolve(dir) {
    return path.join(__dirname, '.', dir);
}

const config = override(
    // 使用.eslintrc.js
    useEslintRc(),
    // 配置路径别名
    addWebpackAlias({
        '@': resolve(__dirname, 'src')
    }), // 更换主题配置
    addLessLoader({
        lessOptions: {
            // strictMath: true,
            noIeCompat: true,
            modules: true,
            javascriptEnabled: true,
            modifyVars: { '@primary-color': '#7b6aff' }
        }
    }),
    // antd按需加载
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    })
);

module.exports = config;
