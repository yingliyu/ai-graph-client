import React from 'react';
import css from './index.module.less';
export default function Expert(props: any) {
    const { country = '', org = '', resume = '', honorTitle = '' } = props?.data ? props?.data : {};
    const { id, type, name } = props;
    const queryExpert = () => {
        const url = `/graph?q=${name}&id=${id}&type=${0}&qt=${type}`;
        window.open(url, '_blank');
    };
    return (
        <div className={css['expert-layer']}>
            {name && (
                <span className={css['expert-name']} onClick={() => queryExpert()}>
                    {name}
                </span>
            )}
            <ul>
                {props?.data && country && (
                    <li>
                        <span>国籍：</span>
                        <span>{country}</span>
                    </li>
                )}
                {props?.data && org && (
                    <li>
                        <span>机构：</span>
                        <span>{org}</span>
                    </li>
                )}
                {props?.data && honorTitle && (
                    <li>
                        <span>荣誉称号：</span>
                        <span>{honorTitle}</span>
                    </li>
                )}
                {props?.data && resume && (
                    <li>
                        <span>履历：</span>
                        <span
                            className={css['resume-content']}
                            dangerouslySetInnerHTML={{ __html: resume }}
                        ></span>
                    </li>
                )}
            </ul>
        </div>
    );
}
