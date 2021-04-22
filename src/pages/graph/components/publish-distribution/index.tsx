import React from 'react';
import { Radio } from 'antd';
import useSize from '../../../../hooks/size';
import ContainerItem from '../container-item';
import Bar from '../../../../components/charts/bar';
import RadioBtnGroup from '../../../../components/radio-group';
import css from './index.module.less';

export default function PublishDistribution(props: any) {
    const { visualData, styles, onChange, type } = props;
    const { commonW, commonH } = useSize();
    return (
        <ContainerItem title="国家机构发文分布" {...styles}>
            <div className={css['publish-type']} style={{ color: '#fff', padding: '10px' }}>
                <RadioBtnGroup
                    onChange={onChange}
                    name="radiogroup"
                    value={type}
                    size="small"
                    list={['国家', '机构']}
                />
            </div>

            {visualData?.nationDistributionList?.length ? (
                type === 0 ? (
                    <div className={css['nation-distribution']}>
                        <Bar
                            width={commonW}
                            height={commonH - 10}
                            showLegend={true}
                            grid={{
                                left: '60%',
                                right: '1%',
                                bottom: '10%',
                                top: '10%'
                            }}
                            data={visualData?.nationDistributionList}
                            canvasContainer="nationDistributeBar"
                        />
                    </div>
                ) : (
                    <div className={css['org-distribution']}>
                        <Bar
                            width={commonW}
                            height={commonH - 10}
                            showLegend={true}
                            grid={{
                                left: '60%',
                                right: '1%',
                                bottom: '10%',
                                top: '10%'
                            }}
                            data={visualData?.orgDistributionList}
                            canvasContainer="orgDistributeBar"
                        />
                    </div>
                )
            ) : (
                <div style={{ width: commonW, height: 2 * commonH - 20 }}></div>
            )}
        </ContainerItem>
    );
}
