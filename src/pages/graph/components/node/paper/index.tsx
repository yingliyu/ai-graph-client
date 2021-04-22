import React from 'react';
import css from './index.module.less';
import { Tag, Tooltip } from 'antd';
export default function Paper(props: any) {
    const { journal, publish_time, summary, tag, title } = props;
    return (
        <div className={css['paper-layer']}>
            {title && <span dangerouslySetInnerHTML={{ __html: title }}></span>}
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
                {journal && (
                    <li>
                        <span>期刊名称：</span>

                        <span>{journal}</span>
                    </li>
                )}
                {publish_time && (
                    <li>
                        <span>发表时间：</span>
                        <span>{publish_time}</span>
                    </li>
                )}
                {summary && (
                    <li>
                        <span>摘要：</span>
                        <span dangerouslySetInnerHTML={{ __html: summary }}></span>
                    </li>
                )}
            </ul>
        </div>
    );
}
