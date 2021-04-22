import React from 'react';
import { List, Tooltip } from 'antd';
import css from './index.module.less';
export default function ProjectLayer(props: any) {
    const { projectCnt, projects } = props;

    return (
        <div className={css['project-layer']}>
            <List
                itemLayout="vertical"
                footer={null}
                dataSource={projects}
                renderItem={(item: any) => (
                    <List.Item key={item.title}>
                        <List.Item.Meta
                            avatar={null}
                            title={
                                <div className={css['project-head']}>
                                    <Tooltip placement="left" title={item.title}>
                                        <span className={css['project-titile']}>{item.title}</span>
                                    </Tooltip>
                                    <small>{item.publishTime}</small>
                                </div>
                            }
                            description={
                                <Tooltip placement="left" title={item.orgName}>
                                    {item.orgName}
                                </Tooltip>
                            }
                        />
                        <Tooltip
                            overlayStyle={{ minWidth: 500 }}
                            placement="left"
                            title={item.summary}
                        >
                            {item.summary && (
                                <div className={css['project-abstract']}>摘要：{item.summary}</div>
                            )}
                        </Tooltip>
                    </List.Item>
                )}
            ></List>
        </div>
    );
}
