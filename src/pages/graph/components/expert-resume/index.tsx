import React from 'react';
import css from './index.module.less';
import ContainerItem from '../container-item';

const ExpertResume = (props: any) => {
    const {
        honorTitleArray,
        allOrgArray,
        orgPositionArray,
        resume,
        showMore,
        styles,
        width,
        height
    } = props;
    return (
        <ContainerItem title="履历" {...styles}>
            <div className={css['expert-resume']} style={{ width: width, height: height }}>
                <ul>
                    {honorTitleArray && honorTitleArray.length ? (
                        <li>
                            <span>荣誉:</span>
                            <span>{honorTitleArray.join('、')}</span>
                        </li>
                    ) : null}
                    {orgPositionArray && orgPositionArray.length ? (
                        <li>
                            <span>职务/职称:</span>
                            <span>{orgPositionArray.join('、')}</span>
                        </li>
                    ) : null}

                    {allOrgArray && allOrgArray.length ? (
                        <li>
                            <span>机构:</span>
                            <ol>
                                {allOrgArray?.map((item: string) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ol>
                        </li>
                    ) : null}
                    {resume ? (
                        <li>
                            <span>履历:</span>
                            <span className={css['resume-content']}>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            resume?.length > 100
                                                ? resume?.slice(0, 100) + '...'
                                                : resume
                                    }}
                                />
                                {/* {resume?.length > 100 ? <a onClick={showMore}>展示全部</a> : null} */}
                            </span>
                        </li>
                    ) : null}
                </ul>

                {resume && resume?.length > 60 ? (
                    <a className={css['more-detail']} onClick={() => showMore('履历', resume)}>
                        查看更多
                    </a>
                ) : null}
            </div>{' '}
        </ContainerItem>
    );
};

export default ExpertResume;
