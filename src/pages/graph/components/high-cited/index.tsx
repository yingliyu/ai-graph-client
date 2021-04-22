import React from 'react';
import useSize from '../../../../hooks/size';
import ContainerItem from '../container-item';
import Bar from '../../../../components/charts/bar';

export default function HighCited(props: any) {
    const { visualData, styles } = props;
    const { commonW, highCitedH } = useSize();

    return (
        <ContainerItem title="高被引占比" {...styles}>
            {visualData?.topDistributionList ? (
                <Bar
                    width={commonW}
                    height={highCitedH}
                    data={visualData?.topDistributionList}
                    canvasContainer="verticalBarContainer"
                    showYAxis={true}
                    showLegend={false}
                    grid={{
                        left: '30%',
                        right: '14%',
                        bottom: '10%',
                        top: '10%'
                        // containLabel: true
                    }}
                    barBorderRadius={30}
                    align="herizon"
                />
            ) : (
                <div style={{ width: commonW, height: highCitedH }}></div>
            )}
        </ContainerItem>
    );
}
