import React from 'react';
import { Radio } from 'antd';
import css from './index.module.less';

export default function RadioBtnGroup(props: any) {
    const { onChange, value, name, size, list } = props;
    return (
        <div className={css['radio-group']} style={{ color: '#fff', padding: '10px' }}>
            <Radio.Group onChange={onChange} name={name} value={value} size={size}>
                {list.map((item: any, index: any) => (
                    <Radio.Button value={index} key={item}>
                        {item}
                    </Radio.Button>
                ))}
            </Radio.Group>
        </div>
    );
}
