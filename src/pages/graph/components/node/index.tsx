import React, { useState } from 'react';
import css from './index.module.less';
import { Tag, Icon } from 'antd';
import ExpertLayer from './expert';
import OrganLayer from './organ';
import JournalLayer from './journal';
import SubjectLayer from './subject';
import PaperLayer from './paper';
import PatentLayer from './patent';
import ProjectLayer from './project';
import { ALL_NODE_TYPES as nodeType } from '../../../../utils/constant';

export default function NodeLayer(props: any) {
    const { name, type, data } = props;

    // const [showLayer, setShowLayer] = useState(true);
    const renderDetailByType = () => {
        switch (type) {
            case 'EXPERT':
                return <ExpertLayer {...props} />;
            case 'SUBJECT':
                return <SubjectLayer {...props} />;
            case 'ORG':
                return <OrganLayer {...data} />;
            case 'JOURNAL':
                return <JournalLayer {...data} />;
            case 'PAPER':
                return <PaperLayer {...data} />;
            case 'PATENT':
                return <PatentLayer {...data} />;
            case 'PROJECT':
                return <ProjectLayer {...data} />;
        }
    };
    return (
        // <div className={css['node-layer']} style={{ display: showLayer ? 'block' : 'none' }}>
        <div className={css['node-layer']}>
            <div className={css['layer-header']}>
                <div>
                    <Tag color="#9B8EFF">实体</Tag>
                    <span>:&nbsp;&nbsp;</span>
                    <Tag color="#9B8EFF">{nodeType[type]}</Tag>
                </div>

                {/* <small>
                    <Icon type="close-circle" />
                </small> */}
            </div>
            <div className={css['layer-content']}>{renderDetailByType()}</div>
        </div>
    );
}
