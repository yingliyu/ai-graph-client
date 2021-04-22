import React from 'react';
import css from './index.module.less';
import { Tag } from 'antd';
export default function FieldLayer(props: any) {
    const { data } = props;
    return (
        <div className={css['field-wrapper']}>
            <span>共同领域：</span>
            <div>
                {data?.map((item: any) => (
                    <Tag key={item} color="#9B8EFF">
                        {item}
                    </Tag>
                ))}
            </div>
        </div>
    );
}
