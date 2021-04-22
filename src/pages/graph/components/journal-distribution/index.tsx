import React from 'react';
import useSize from '../../../../hooks/size';
import ContainerItem from '../container-item';
import Bar from '../../../../components/charts/bar';

export default function JournalDistribution(props: any) {
    const { visualData, styles } = props;
    const { commonW, commonH } = useSize();
    return (
        <ContainerItem title="发文期刊分布" {...styles}>
            {visualData?.journalDistributionList?.length ? (
                <Bar
                    width={commonW}
                    height={commonH - 10}
                    grid={{
                        left: '55%',
                        right: '1%',
                        bottom: '10%',
                        top: '10%'
                    }}
                    data={visualData?.journalDistributionList}
                    canvasContainer="barContainer"
                />
            ) : (
                <div style={{ width: commonW, height: commonH - 10 }}></div>
            )}
        </ContainerItem>
    );
}
