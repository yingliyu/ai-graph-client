import React from 'react';
import { List, Tooltip } from 'antd';
import css from './index.module.less';
export default function PaperLayer(props: any) {
    const { paperCnt, papers } = props;
    const getReactNode = (title: any): React.ReactNode => {
        return <span dangerouslySetInnerHTML={{ __html: title }} />;
    };
    return (
        <div className={css['paper-layer']}>
            <List
                itemLayout="vertical"
                footer={null}
                dataSource={papers}
                renderItem={(item: any) => (
                    <List.Item key={item.title}>
                        <List.Item.Meta
                            avatar={null}
                            title={
                                <div className={css['paper-head']}>
                                    <Tooltip placement="left" title={getReactNode(item.title)}>
                                        {/* <span className={css['paper-titile']}>{item.title}</span> */}
                                        <span
                                            className={css['paper-titile']}
                                            dangerouslySetInnerHTML={{ __html: item.title }}
                                        />
                                    </Tooltip>
                                    <small>{item.publishTime}</small>
                                </div>
                            }
                            description={
                                <Tooltip placement="left" title={item.journal}>
                                    {item.journal}
                                </Tooltip>
                            }
                        />

                        <Tooltip
                            overlayStyle={{ minWidth: 500 }}
                            placement="left"
                            title={getReactNode(item.summary)}
                        >
                            {item.summary && (
                                <div className={css['paper-abstract']}>
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
