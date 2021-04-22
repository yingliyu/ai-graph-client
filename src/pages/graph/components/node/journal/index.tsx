import React from 'react';
import css from './index.module.less';
export default function Journal(props: any) {
    const { title, abbr, isTop, impactFactor, country } = props;
    return (
        <div className={css['journal-layer']}>
            {title && <span>{title}</span>}
            <ul>
                {isTop && (
                    <li>
                        <span>是否是TOP：</span>
                        <span>{isTop}</span>
                    </li>
                )}
                {impactFactor && (
                    <li>
                        <span>影响因子：</span>
                        <span>{impactFactor}</span>
                    </li>
                )}
                {country && (
                    <li>
                        <span>所属国家</span>
                        <span>{country}</span>
                    </li>
                )}
            </ul>
        </div>
    );
}
