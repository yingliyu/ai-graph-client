import React from 'react';
import Fullscreen from '../../../../components/fullscreen';
import css from './index.module.less';
export default function Header(props: any) {
    //返回首页
    const backHome = () => {
        props.history.push('/');
    };
    return (
        <header className={css['header']}>
            <h3 onClick={backHome}>上海人工智能公共研发资源图谱</h3>
            {/* <Fullscreen /> */}
        </header>
    );
}
