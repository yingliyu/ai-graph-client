import React from 'react';
import css from './index.module.less';
// 专家-期刊 发表 关系浮层
export default function PublishLayer(props: any) {
    const { data } = props;
    return <div className={css['publish-journals']}>发表次数：{data}</div>;
}
