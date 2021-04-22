import React from 'react';
import css from './index.module.less';
export default function GraduateLayer(props: any) {
    const { graduated, graduatedTime } = props;
    return (
        <div className={css['graduate-layer']}>
            <ul>
                {graduated && (
                    <li>
                        <span>毕业于：</span>
                        <span>{graduated}</span>
                    </li>
                )}
                {graduatedTime && (
                    <li>
                        <span>毕业时间：</span>
                        <span>{graduatedTime}</span>
                    </li>
                )}
            </ul>
        </div>
    );
}
