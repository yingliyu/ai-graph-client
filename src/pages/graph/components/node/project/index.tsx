import React from 'react';
import css from './index.module.less';
import { Tag, Tooltip } from 'antd';
export default function Project(props: any) {
    const { approveTime, leader, money, tag, title, type, unit, summary } = props;
    return (
        <div className={css['project-layer']}>
            {title && <span>{title}</span>}
            <ul>
                {tag && (
                    <li>
                        <span>学科标签：</span>
                        <span className={css['subject-tags']}>
                            {tag?.split(',').map((item: any, index: number) => (
                                <Tag key={item + '_' + index} color="geekblue">
                                    {item}
                                </Tag>
                            ))}
                        </span>
                    </li>
                )}
                {type && (
                    <li>
                        <span>项目类别：</span>
                        <span>{type}</span>
                    </li>
                )}
                {leader && (
                    <li>
                        <span>负责人：</span>
                        <span>{leader}</span>
                    </li>
                )}
                {money && (
                    <li>
                        <span>经费：</span>
                        <span>{money}</span>
                    </li>
                )}
                {unit && (
                    <li>
                        <span>依托单位：</span>
                        <span>{unit}</span>
                    </li>
                )}
                {approveTime && (
                    <li>
                        <span>批准时间：</span>
                        <span>{approveTime}</span>
                    </li>
                )}
                {summary && (
                    <li>
                        <span>摘 要：</span>
                        <span>{summary}</span>
                    </li>
                )}
            </ul>
        </div>
    );
}
