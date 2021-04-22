import React, { useState } from 'react';
import { Tabs, Tag } from 'antd';
import css from './index.module.less';
import FieldLayer from './field';
import AcademicLayer from './academic-exchange';
import PaperLayer from './paper';
import PatentLayer from './patent';
import OfficeLayer from './office';
import GraduateLayer from './graduate';
import ProjectLayer from './project';
import PublishJournal from './publish-journal';
import { RELATION_TYPES } from '../../../../utils/constant';
import { relative } from 'path';
const icon = require('./imgs/change.png');
const { TabPane } = Tabs;

export default function RelationLayer(props: any) {
    const {
        relType,
        targetType,
        sourceName,
        data,
        data: { entityClickable, entityId, entityName, entityType, relatedLink }
    } = props;
    // const [showLayer, setShowLayer] = useState(true);

    // const closeLayerHandle = () => {
    //     setShowLayer(false);
    // };

    // 根据两实体之间的关系类型返回对应的组件
    const renderTabItemByType = (item: string) => {

        switch (item) {
            case 'samePapers':
                return relatedLink.samePapers?.papers && <PaperLayer {...relatedLink.samePapers} />;
            case 'samePatents':
                return (
                    relatedLink.samePatents?.patents && <PatentLayer {...relatedLink.samePatents} />
                );
            case 'sameDomains':
                return <FieldLayer data={relatedLink.sameDomains} />;
            case 'pubJournal':
                return <PublishJournal data={relatedLink.pubJournal} />;
            case 'tenure':
                return <OfficeLayer org={entityName} {...relatedLink.tenure} />;
            case 'graduate':
                return <GraduateLayer {...relatedLink.graduate} />;
            case 'academicExchange':
                return <AcademicLayer data={relatedLink.academicExchange} />;
            case 'coPapers':
                return relatedLink.coPapers?.papers && <PaperLayer {...relatedLink.coPapers} />;
            case 'coPatents':
                return relatedLink.coPatents?.patents && <PatentLayer {...relatedLink.coPatents} />;
            case 'coProjects':
                return (
                    relatedLink.coProjects?.projects && <ProjectLayer {...relatedLink.coProjects} />
                );
        }
    };
    // （实体间多种关系时）共同发文/专利数
    const getCntByRelType = (item: string) => {
        switch (item) {
            case 'samePapers':
                return relatedLink.samePapers?.paperCnt
                    ? `(${relatedLink.samePapers?.paperCnt}篇)`
                    : '';
            case 'samePatents':
                return relatedLink.samePatents?.patentCnt
                    ? `(${relatedLink.samePatents?.patentCnt}篇)`
                    : '';
            case 'coPapers':
                return relatedLink.coPapers?.paperCnt ? `(${relatedLink.coPapers.paperCnt}篇)` : '';
            case 'coPatents':
                return relatedLink.coPatents?.patentCnt
                    ? `(${relatedLink.coPatents?.patentCnt}篇)`
                    : '';
            case 'coProjects':
                return relatedLink.coProjects?.projectCnt
                    ? `(${relatedLink.coProjects?.projectCnt}篇)`
                    : '';
            default:
                return '';
        }
    };
    // 渲染tab
    const renderTab = () => {
        if (relatedLink && relatedLink.typeList.length) {
            return relatedLink.typeList.length === 1 ? (
                renderTabItemByType(relatedLink.typeList[0])
            ) : (
                <Tabs size="small" tabBarGutter={0}>
                    {relatedLink.typeList.map((item: string) => (
                        <TabPane tab={RELATION_TYPES[item] + getCntByRelType(item)} key={item}>
                            {renderTabItemByType(item)}
                        </TabPane>
                    ))}
                </Tabs>
            );
        }
        return null;
    };
    // （仅一种关系时）渲染共同发文等数目
    const renderCnt = () => {
        const type = relatedLink?.typeList[0];
        const ifShow =
            type === 'samePapers' ||
            type === 'samePatents' ||
            type === 'coPapers' ||
            type === 'coPatents' ||
            type === 'coProjects';

        if (ifShow && relatedLink?.typeList?.length === 1) {
            return (
                <small style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                    {RELATION_TYPES[relatedLink.typeList[0]]}
                    {relatedLink?.samePapers?.paperCnt ||
                        relatedLink?.coPapers?.paperCnt ||
                        relatedLink?.samePatents?.patentCnt ||
                        relatedLink?.coPatents?.patentCnt ||
                        relatedLink?.coProjects?.projectCnt}
                    篇
                </small>
            );
        }
        return null;
    };
    const enterGraph = () => {
        if (entityClickable) {
            const url = `/graph?q=${entityName}&id=${entityId}&type=${0}&qt=${entityType}`;
            window.open(url, '_blank');
        }
    };
    return (
        // <div className={css['relation-layer']} style={{ display: showLayer ? 'block' : 'none' }}>
        <div className={css['relation-layer']}>
            <div className={css['layer-tags']}>
                <div>
                    <Tag color="#9B8EFF">关系</Tag>

                    {relatedLink?.typeList.length === 1 ? (
                        <>
                            <i>:&nbsp;&nbsp;</i>
                            <Tag color="#9B8EFF">{RELATION_TYPES[relatedLink.typeList[0]]}</Tag>
                        </>
                    ) : null}
                </div>
            </div>
            <div className={css['layer-content']}>
                <div className={css['layer-header']}>
                    <span>
                        {sourceName}
                        <img
                            width="15px"
                            style={{ margin: '0 5px', position: 'relative', top: '3px' }}
                            src={icon}
                        ></img>
                        <span
                            className={entityClickable ? css['expert-clickable'] : ''}
                            onClick={enterGraph}
                        >
                            {entityName}
                        </span>
                    </span>
                    {renderCnt()}
                </div>
                <div className={css['layer-body']}>{renderTab()}</div>
            </div>
        </div>
    );
}
