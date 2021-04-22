import React from 'react';
import css from './index.module.less';
// 学术交流关系浮层

export default function AcademicLayer(props: any) {
    const { data } = props;

    return <div className={css['academic-exahange']}>{data || '学术交流'}</div>;
}
