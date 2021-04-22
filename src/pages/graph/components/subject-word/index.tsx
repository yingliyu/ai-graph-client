import React from 'react';
import { Tooltip } from 'antd';
import ContainerItem from '../container-item';
import css from './index.module.less';

export default function SubjectWord(props: any) {
    const { visualData, styles } = props;
    return (
        <ContainerItem {...styles}>
            <div className={css['subject-info']}>
                <Tooltip placement="right" title={visualData?.nameCh}>
                    <p>{visualData?.nameCh || ''}</p>
                </Tooltip>
                <Tooltip placement="right" title={visualData?.nameEn}>
                    <p>{visualData?.nameEn || ''}</p>
                </Tooltip>
            </div>
        </ContainerItem>
    );
}
