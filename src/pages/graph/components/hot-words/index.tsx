import React from 'react';
import useSize from '../../../../hooks/size';
import ContainerItem from '../container-item';
import WordCloud from '../../../../components/word-cloud';

export default function HotWords(props: any) {
    const { visualData, queryValue, styles } = props;
    const { commonW, hotWordsH, wordCloudFontSizeRange } = useSize();
    return (
        <ContainerItem title="热词分布" {...styles}>
            {visualData?.subjectRelatedList?.length ? (
                <WordCloud
                    fontSizeRange={
                        queryValue.entityType === 'EXPERT'
                            ? wordCloudFontSizeRange
                            : [
                                  wordCloudFontSizeRange[0],
                                  (wordCloudFontSizeRange[0] + wordCloudFontSizeRange[1]) / 2
                              ]
                    }
                    width={commonW}
                    height={hotWordsH}
                    list={visualData?.subjectRelatedList}
                    canvasContainer="hotWords"
                />
            ) : (
                <div style={{ width: commonW, height: hotWordsH }}></div>
            )}
        </ContainerItem>
    );
}
