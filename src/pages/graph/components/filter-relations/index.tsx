import React, { useState } from 'react';
import { Table, Checkbox, Button } from 'antd';
import css from './index.module.less';
const closeFilterIcon = require('./imgs/close.png');
const CheckboxGroup: any = Checkbox.Group;

const checkboxOptions: any = {
    expert: [
        {
            name: 'samePapers',
            value: '共同发文',
            label: '共同发文'
        },
        {
            name: 'samePatents',
            value: '共同专利',
            label: '共同专利'
        },
        {
            name: 'sameDomains',
            value: '同领域',
            label: '同领域'
        }
    ],
    org: [
        { name: 'tenure', label: '任职', value: '任职' },
        { name: 'coPapers', label: '论文合作', value: '论文合作' },
        { name: 'coPatents', label: '专利合作', value: '专利合作' },
        { name: 'coProjects', label: '项目合作', value: '项目合作' },
        { name: 'graduate', label: '毕业', value: '毕业' },
        { name: 'academicExchange', label: '学术交流', value: '学术交流' }
    ],
    journal: [{ name: 'pubJournal', label: '发表', value: '发表' }]
};
export default function FilterPage(props: any) {
    const { selectedId, selectValue, selectedEntityType, setShowFilter, getGraphData } = props;
    // 专家-专家关系
    const expertList = checkboxOptions.expert.map((item: any) => item.value);
    const [checkedExpertList, setCheckedExpertList] = useState(expertList);
    const [indeterminateExpert, setIndeterminateExpert] = useState(false);
    const [checkExpertAll, setCheckExpertAll] = useState(true);

    const onExpertChange = (list: any) => {
        setCheckedExpertList(list);
        setIndeterminateExpert(!!list.length && list.length < expertList.length);
        setCheckExpertAll(list.length === expertList.length);
    };

    const onCheckExpertAllChange = (e: any) => {
        setCheckedExpertList(e.target.checked ? expertList : []);
        setIndeterminateExpert(false);
        setCheckExpertAll(e.target.checked);
    };

    // 专家-机构
    const orgList = checkboxOptions.org.map((item: any) => item.value);
    const [checkedOrgList, setCheckedOrgList] = React.useState(orgList);
    const [indeterminateOrg, setIndeterminateOrg] = React.useState(false);
    const [checkOrgAll, setCheckOrgAll] = React.useState(true);

    const onOrgChange = (list: any) => {
        setCheckedOrgList(list);
        setIndeterminateOrg(!!list.length && list.length < orgList.length);
        setCheckOrgAll(list.length === orgList.length);
    };

    const onCheckOrgAllChange = (e: any) => {
        setCheckedOrgList(e.target.checked ? orgList : []);
        setIndeterminateOrg(false);
        setCheckOrgAll(e.target.checked);
    };
    // 专家-期刊
    const journalList = checkboxOptions.journal.map((item: any) => item.value);
    const [checkedJournalList, setCheckedJournalList] = React.useState(journalList);
    const [indeterminateJournal, setIndeterminatJournal] = React.useState(false);
    const [checkJournalAll, setCheckJournalAll] = React.useState(true);

    const onJournalChange = (list: any) => {
        setCheckedJournalList(list);
        setIndeterminatJournal(!!list.length && list.length < journalList.length);
        setCheckJournalAll(list.length === journalList.length);
    };

    const onCheckJournalAllChange = (e: any) => {
        setCheckedJournalList(e.target.checked ? journalList : []);
        setIndeterminatJournal(false);
        setCheckJournalAll(e.target.checked);
    };

    interface DataType {
        key: React.Key;
        name: string;
        render?: any;
        type: string;
    }

    const data: DataType[] = [
        {
            key: 'expert',
            name: '专家',
            type: 'expert'
        },
        {
            key: 'org',
            name: '机构',
            type: 'org'
        },
        {
            key: 'journal',
            name: '期刊',
            type: 'journal'
        }
    ];
    const [selectedKeys, setSelectedKeys] = useState<any>(Object.keys(checkboxOptions));
    // rowSelection object indicates the need for row selection
    const rowSelection = {
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedKeys(selectedRowKeys);
            onExpertChange(
                selectedRowKeys.includes('expert')
                    ? checkedExpertList.length
                        ? checkedExpertList
                        : expertList
                    : []
            );
            onOrgChange(
                selectedRowKeys.includes('org')
                    ? checkedOrgList.length
                        ? checkedOrgList
                        : orgList
                    : []
            );
            onJournalChange(
                selectedRowKeys.includes('journal')
                    ? checkedJournalList.length
                        ? checkedJournalList
                        : journalList
                    : []
            );
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
            width: '30%'
        },
        {
            title: '关系类型',
            dataIndex: 'type',
            width: '50%',
            render: (type: string) => {
                // console.log(type);
                let indeterminate;
                let checkAll;
                let checkedList;
                let onCheckAllChange: any;
                let onChange;
                if (type === 'expert') {
                    indeterminate = indeterminateExpert;
                    checkAll = checkExpertAll;
                    checkedList = checkedExpertList;
                    onCheckAllChange = onCheckExpertAllChange;
                    onChange = onExpertChange;
                } else if (type === 'org') {
                    indeterminate = indeterminateOrg;
                    checkAll = checkOrgAll;
                    checkedList = checkedOrgList;
                    onCheckAllChange = onCheckOrgAllChange;
                    onChange = onOrgChange;
                } else if (type === 'journal') {
                    indeterminate = indeterminateJournal;
                    checkAll = checkJournalAll;
                    checkedList = checkedJournalList;
                    onCheckAllChange = onCheckJournalAllChange;
                    onChange = onJournalChange;
                }

                return (
                    selectedKeys.includes(type) && (
                        <div>
                            <Checkbox
                                indeterminate={indeterminate}
                                onChange={onCheckAllChange}
                                checked={checkAll}
                            >
                                全选
                            </Checkbox>
                            <CheckboxGroup
                                options={checkboxOptions[type]}
                                value={checkedList}
                                onChange={onChange}
                            />
                        </div>
                    )
                );
            }
        }
    ];
    const getFilterGraph = () => {
        const nodesTypes = selectedKeys.map((item: string) => item.toUpperCase());
        const relations = [...checkedExpertList, ...checkedOrgList, ...checkedJournalList];
        // console.log('类型: ', nodesTypes);
        // console.log('关系：', relations);
        const params: any = {
            entityId: selectedId,
            entityName: selectValue
        };
        if (nodesTypes.length) params.entityTypes = nodesTypes;
        if (relations.length) params.relationTypes = relations;
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
                    dataSource={data}
                />
                <Button onClick={getFilterGraph} className="ant-btn-primary" size="small">
                    确 认
                </Button>
            </div>
        </div>
    );
}
