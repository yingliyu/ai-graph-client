import React from 'react';
import css from './index.module.less';
import ContainerItem from '../container-item';

// 学科词 -- 百科
const Encyclopedia = (props: any) => {
    const { visualData, showMore, styles } = props;

    return (
        <ContainerItem title="百科" {...styles}>
            <div className={css['encyclopedia-info']} id="encyclopedia">
                {visualData?.baike}
            </div>
            {visualData?.baike ? (
                <a
                    className={css['more-detail']}
                    onClick={() => showMore('百科', visualData?.baike)}
                >
                    展示全部
                </a>
            ) : null}
        </ContainerItem>
    );
};

export default Encyclopedia;
