import React from 'react';
import css from './index.module.less';
import { Tag, Tooltip } from 'antd';
export default function Patent(props: any) {
    const { title, legalStatus, org, publishTime, summary, tag } = props;
    return (
        <div className={css['patent-layer']}>
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
                {legalStatus && (
                    <li>
                        <span>法律状态：</span>
                        <span>{legalStatus}</span>
                    </li>
                )}
                {org && (
                    <li>
                        <span>机构名：</span>
                        <span>{org}</span>
                    </li>
                )}
                {publishTime && (
                    <li>
                        <span>发表时间：</span>
                        <span>{publishTime}</span>
                    </li>
                )}
                {summary && (
                    <li>
                        <span>摘要：</span>
                        <span
                            className={css['abstract-content']}
                            dangerouslySetInnerHTML={{ __html: summary }}
                        ></span>
                    </li>
                )}
            </ul>
        </div>
    );
}
