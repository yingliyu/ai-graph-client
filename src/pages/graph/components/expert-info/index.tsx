import React from 'react';
import { Tooltip } from 'antd';
import css from './index.module.less';
const expertImg = require('./imgs/user.png');
const ExpertInfo = (props: any) => {
    const {
        photo,
        nameCh,
        nameEn,
        org,
        totalPublication,
        totalCitation,
        hIndex,
        top1Citation,
        literatureTotal
    } = props;
    return (
        <div className={css['expert-info']}>
            <div className={css['expert-head']}>
                <div className={css['expert-head-wrapper']}>
                    <img src={photo ? photo : expertImg} alt="专家头像" />
                </div>
                <div className={css['name-wrapper']}>
                    {nameCh && (
                        <Tooltip placement="right" title={nameCh}>
                            <h5 className={css['limit-one-line']}>{nameCh || ''}</h5>
                        </Tooltip>
                    )}
                    {nameEn && (
                        <Tooltip placement="right" title={nameEn}>
                            <span className={css['limit-one-line']}>{nameEn || ''}</span>
                        </Tooltip>
                    )}

                    {org && (
                        <Tooltip placement="right" title={org || ''}>
                            <span>{org}</span>
                        </Tooltip>
                    )}
                </div>
            </div>
            <ul>
                <li>
                    <span>总发文数：</span>
                    <b>
                        {totalPublication > literatureTotal
                            ? totalPublication
                            : literatureTotal || 0}
                    </b>
                </li>
                <li>
                    <span>总被引数：</span>
                    <b>{totalCitation || 0}</b>
                </li>
                <li>
                    <span>H指数：</span>
                    <b>{hIndex || 0}</b>
                </li>
                <li>
                    <span>前1%高被引数：</span>
                    <b>{top1Citation || 0}%</b>
                </li>
            </ul>
        </div>
    );
};

export default ExpertInfo;
