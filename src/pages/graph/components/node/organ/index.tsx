import React from 'react';
import css from './index.module.less';
export default function Organ(props: any) {
    const { org, provinceCountry, type } = props;
    return (
        <div className={css['organ-layer']}>
            {org && <span>{org}</span>}
            <ul>
                {type && (
                    <li>
                        <span>单位性质：</span>
                        <span>{type}</span>
                    </li>
                )}
                {provinceCountry && (
                    <li>
                        <span>所属国家：</span>
                        <span>{provinceCountry}</span>
                    </li>
                )}
            </ul>
        </div>
    );
}
