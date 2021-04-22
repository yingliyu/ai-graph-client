// 根据当前mode获取Base Url 类型
const env = process.env.REACT_APP_SSTIR_GRAPH;

// 根据VUE_APP_BASE_URL_TYPE获取BASE_URL
const getBaseUrl = (env) => {
    switch (env) {
        // development
        case 'dev':
            return {
                baseUrl: 'http://dev.api.aikg.test.sstir.cn'
            };
        // production
        case 'prod':
            return {
                baseUrl: 'http://aikg-api.sciplus.cloud'
            };
        case 'qa':
            return {
                baseUrl: 'http://api.aikg.test.sstir.cn'
            };
        // default: dev
        default:
            return {
                baseUrl: 'http://dev.api.aikg.test.sstir.cn'
            };
    }
};

const appConfig = {
    baseUrl: getBaseUrl(env).baseUrl
};

export default appConfig;
