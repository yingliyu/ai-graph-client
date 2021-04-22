import React, { useEffect } from 'react';
import { Tooltip } from 'antd';
import css from './index.module.less';
import ContainerItem from '../container-item';
const expertImg = require('./imgs/expert-head.png');

// 高发文专家
const RelevantExpert = (props: any) => {
    const { list, styles, showMore } = props;
    const ChineseReg = /^[\u4e00-\u9fa5]/;

    const orgRender = (text: string, length: number) => {
        if (ChineseReg.test(text)) {
            return text.length > length ? (
                <Tooltip placement="right" title={text || ''}>
                    <span className={css['org-name']}> {text.slice(0, length) + '...'}</span>
                </Tooltip>
            ) : (
                <span className={css['org-name']}>{text || ''}</span>
            );
        } else {
            const len = length * 2;

            return text.length > len ? (
                <Tooltip placement="right" title={text || ''}>
                    <span className={css['org-name']}> {text.slice(0, len) + '...'}</span>
                </Tooltip>
            ) : (
                <span className={css['org-name']}>{text || ''}</span>
            );
        }
    };

    const nameEle = (clickable: boolean, name: string, expertId: string) => {
        return (
            <span>
                {clickable ? (
                    <a target="_blank" href={`/graph?q=${name}&id=${expertId}&type=0&qt=EXPERT`}>
                        {name}
                    </a>
                ) : (
                    <>{name}</>
                )}
            </span>
        );
    };
    const nameRender = (item: any, length: number) => {
        const clickable: boolean = item.click;
        const name: string = item.nameCh ? item.nameCh : item.nameEn;
        const expertId: string = item.expertId;
        if (ChineseReg.test(name)) {
            return name.length > length ? (
                <Tooltip placement="right" title={name}>
                    {nameEle(item.click, name.slice(0, length) + '...', expertId)}
                </Tooltip>
            ) : (
                <>{nameEle(clickable, name, expertId)}</>
            );
        } else {
            // 中文名字为空时取英文名字
            const len = length * 2;
            return name.length > len ? (
                <Tooltip placement="right" title={name}>
                    {nameEle(item.click, name.slice(0, len) + '...', expertId)}
                </Tooltip>
            ) : (
                <> {nameEle(clickable, name, expertId)}</>
            );
        }
    };
    return (
        <ContainerItem title="相关专家" {...styles}>
            <div className={css['relevant-expert']}>
                <section className={css['figure-wrapper']}>
                    {list?.map((item: any, index: number) => {
                        return (
                            index < 4 && (
                                <figure key={index}>
                                    <img src={item.phone || expertImg} />
                                    <p>
                                        {(item.nameCh || item.nameEn) && nameRender(item, 7)}

                                        {item.org && orgRender(item.org, 7)}
                                    </p>
                                </figure>
                            )
                        );
                    })}
                </section>
                <section className={css['figure-wrapper']}>
                    {list?.map((item: any, index: number) => {
                        return (
                            index > 3 &&
                            index < 8 && (
                                <figure key={index}>
                                    <img src={item.phone || expertImg} />
                                    <p>
                                        {(item.nameCh || item.nameEn) && nameRender(item, 7)}

                                        {item.org && orgRender(item.org, 7)}
                                    </p>
                                </figure>
                            )
                        );
                    })}
                </section>
                <a className={css['more-detail']} onClick={showMore}>
                    更多
                </a>
            </div>
        </ContainerItem>
    );
};

export default RelevantExpert;
