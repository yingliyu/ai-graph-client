import React from 'react';
import useSize from '../../../../hooks/size';
import ContainerItem from '../container-item';
// import WordCloud from '../../../../components/word-cloud';
import Tree from '../../../../components/charts/tree';

export default function SubjectDistribution(props: any) {
    const { visualData, styles } = props;

    const { commonW, subjectDistH } = useSize();
    return (
        <ContainerItem title="学科分布" {...styles}>
            {visualData?.subjectDistributionNewList?.length ? (
                <Tree
                    width={commonW}
                    height={subjectDistH}
                    data={visualData.subjectDistributionNewList}
                />
            ) : (
                // <WordCloud
                //     fontSizeRange={
                //         queryValue.entityType === 'EXPERT'
                //             ? wordCloudFontSizeRange
                //             : [
                //                   wordCloudFontSizeRange[0],
                //                   (wordCloudFontSizeRange[0] + wordCloudFontSizeRange[1]) / 2
                //               ]
                //     }
                //     width={commonW}
                //     height={subjectDistH}
                //     list={[]}
                //     canvasContainer="subjectDistribution"
                // />
                <div style={{ width: commonW, height: subjectDistH }}></div>
            )}
        </ContainerItem>
    );
}
