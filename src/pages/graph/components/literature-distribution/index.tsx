import React from 'react';
import useSize from '../../../../hooks/size';
import ContainerItem from '../container-item';
import Ring from '../../../../components/charts/ring';

export default function LiteratureDistribution(props: any) {
    const { visualData, styles } = props;
    const { commonW, commonH, pieRadius } = useSize();

    return (
        <ContainerItem title="文献分布" {...styles}>
            {visualData?.literatureDistribution?.total ? (
                <Ring
                    width={commonW}
                    height={commonH}
                    r={pieRadius}
                    total={visualData?.literatureDistribution?.total}
                    data={visualData?.literatureDistribution?.list}
                    canvasContainer="pieContainer"
                    // type="ring"
                />
            ) : (
                <div style={{ width: commonW, height: commonH }}></div>
            )}
        </ContainerItem>
    );
}
