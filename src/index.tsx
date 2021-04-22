import 'core-js';
import 'core-js/modules/es.map';
import 'regenerator-runtime/runtime';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'raf/polyfill';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import './styles/index.less';
// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
