import React from 'react';
import { List, Tooltip } from 'antd';
import css from './index.module.less';
export default function PatentLayer(props: any) {
    const { patents } = props;
    const getReactNode = (title: any): React.ReactNode => {
        return <span dangerouslySetInnerHTML={{ __html: title }} />;
    };
    return (
        <div className={css['patent-layer']}>
            <List
                itemLayout="vertical"
                footer={null}
                dataSource={patents}
                renderItem={(item: any) => (
                    <List.Item key={item.title}>
                        <List.Item.Meta
                            avatar={null}
                            title={
                                <div className={css['patent-head']}>
                                    <Tooltip placement="left" title={getReactNode(item.title)}>
                                        <span
                                            className={css['patent-titile']}
                                            dangerouslySetInnerHTML={{ __html: item.title }}
                                        ></span>
                                    </Tooltip>
                                    <small>{item.publishTime}</small>
                                </div>
                            }
                        />
                        <Tooltip
                            placement="left"
                            title={getReactNode(item.summary)}
                            overlayStyle={{ minWidth: 500 }}
                        >
                            {item.summary && (
                                <div className={css['patent-abstract']}>
                                    摘要：
                                    <span dangerouslySetInnerHTML={{ __html: item.summary }} />
                                </div>
                            )}
                        </Tooltip>
                    </List.Item>
                )}
            ></List>
        </div>
    );
}
