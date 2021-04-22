import React from 'react';
import css from './index.module.less';
export default function Subject(props: any) {
    const { baike } = props?.data;
    const { id, type, name } = props;

    const querySubject = () => {
        const url = `/graph?q=${name}&id=${id}&type=${0}&qt=${type}`;
        window.open(url, '_blank');
    };
    return (
        <div className={css['subject-layer']}>
            {name && (
                <span className={css['subject-name']} onClick={() => querySubject()}>
                    {name}
                </span>
            )}
            <ul>
                {baike && (
                    <li>
                        <span>百科：</span>
                        <span>{baike}</span>
                    </li>
                )}
            </ul>
        </div>
    );
}
