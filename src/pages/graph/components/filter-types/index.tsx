import React, { useState } from 'react';
import { Table, Button } from 'antd';
import css from './index.module.less';
const closeFilterIcon = require('./imgs/close.png');

export default function FilterPage(props: any) {
    const {
        data,
        selectedId,
        selectValue,
        selectedEntityType,
        setShowFilter,
        getGraphData
    } = props;

    interface DataType {
        key: React.Key;
        name: string;
        type: string;
    }
    let dataSource: DataType[] = [];
    for (let key in data) {
        dataSource.push({
            key: key,
            name: data[key],
            type: key
        });
    }

    const [selectedKeys, setSelectedKeys] = useState<any>(Object.keys(data));
    // rowSelection object indicates the need for row selection
    const rowSelection = {
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedKeys(selectedRowKeys);
        },
        getCheckboxProps: (record: DataType) => {
            // console.log(record);
            const item = {
                // disabled: selectedType.includes(record.type), // Column configuration not to be checked
                name: record.name,
                type: record.type,
                key: record.key
            };

            return item;
        }
    };
    const columns = [
        {
            title: '实体类型',
            dataIndex: 'name',
            render: (text: string) => <a>{text}</a>,
            width: '70%'
        }
    ];
    const getFilterGraph = () => {
        const nodesTypes = selectedKeys.map((item: string) => item.toUpperCase());
        // console.log('类型: ', nodesTypes);
        const params: any = {
            entityId: selectedId,
            entityName: selectValue
        };
        if (nodesTypes.length) params.entityTypes = nodesTypes;
        getGraphData(params);
    };
    return (
        <div className={css['filter-content-wrapper']}>
            <h4>筛选</h4>
            <img
                onClick={() => setShowFilter(false)}
                className={css['close-filter-btn']}
                src={closeFilterIcon}
            ></img>
            <div className={css['filter-body']}>
                <Table
                    size="small"
                    pagination={false}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection
                    }}
                    columns={columns}
                    dataSource={dataSource}
                />
                <Button onClick={getFilterGraph} className="ant-btn-primary" size="small">
                    确 认
                </Button>
            </div>
        </div>
    );
}
