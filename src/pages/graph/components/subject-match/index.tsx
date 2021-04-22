import React from 'react';
import useSize from '../../../../hooks/size';
import ContainerItem from '../container-item';
import Radar from '../../../../components/charts/radar';
import Pie from '../../../../components/charts/pie';
import Ring from '../../../../components/charts/ring';
import RadioBtnGroup from '../../../../components/radio-group';
import css from './index.module.less';

export default function SubjectMatch(props: any) {
    const { visualData, styles, onChange, type } = props;
    const { commonW, commonH, pieRadius } = useSize();

    return (
        <ContainerItem title=" " {...styles}>
            <div className={css['distribution-type']} style={{ color: '#fff', padding: '10px' }}>
                <RadioBtnGroup
                    onChange={onChange}
                    name="radiogroup"
                    value={type}
                    size="small"
                    list={['重点学科匹配度', '文献分布']}
                />
            </div>
            {visualData?.subjectMatch?.list.length &&
            visualData?.literatureDistribution?.list.length ? (
                type === 0 ? (
                    <Radar
                        width={commonW}
                        height={commonH}
                        r={pieRadius}
                        total={visualData?.subjectMatch?.total}
                        data={visualData?.subjectMatch?.list}
                        canvasContainer="simplePieContainer"
                    />
                ) : (
                    <Ring
                        width={commonW}
                        height={commonH}
                        r={pieRadius}
                        total={visualData?.literatureDistribution?.total}
                        data={visualData?.literatureDistribution?.list}
                        canvasContainer="literatureContainer"
                        // type="ring"
                    />
                )
            ) : (
                <div style={{ width: commonW, height: commonH }}></div>
            )}
        </ContainerItem>
    );
}
