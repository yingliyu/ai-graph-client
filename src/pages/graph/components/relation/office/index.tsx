import React from 'react';
import css from './index.module.less';
export default function OfficeLayer(props: any) {
    const { duties, inaugurationTime, org } = props;

    return (
        <div className={css['office-layer']}>
            <ul>
                {duties && (
                    <li>
                        <span>职务：</span>
                        <span>{duties}</span>
                    </li>
                )}
                {inaugurationTime && (
                    <li>
                        <span>就职时间：</span>
                        <span>{inaugurationTime}</span>
                    </li>
                )}
                {!inaugurationTime && !duties ? (
                    <li>
                        <span>就职于：</span>
                        <span>{org}</span>
                    </li>
                ) : null}
            </ul>
        </div>
    );
}
