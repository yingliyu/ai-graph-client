import React from 'react';
import loadable from '@loadable/component';
import Loading from '../components/loading/index.jsx';
const Home = loadable(() => import('../pages/home'), {
    fallback: <Loading />
});
const NotFound = loadable(() => import('../pages/not-found'), {
    fallback: <Loading />
});
const Questions = loadable(() => import('../pages/questions'), {
    fallback: <Loading />
});
export default [
    {
        name: '首页',
        path: '/',
        exact: true,
        component: Home
    },
    {
        name: '说明手册',
        path: '/question',
        exact: true,
        component: Questions
    },
    {
        name: 'Not Found',
        path: '/404',
        exact: true,
        component: NotFound
    }
];
