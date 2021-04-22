import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import useSize from '../../../hooks/size';
// import css from './index.module.less';

export default function Radar(props: any) {
    const { stringMaxLength, legendWidth, legendGap } = useSize();
    const { width, height, r, total, data: list, canvasContainer, type } = props;

    useEffect(() => {
        drawRadar();
    }, [stringMaxLength, total]);
    const drawRadar = () => {
        const container = document.getElementById(canvasContainer) as
            | HTMLDivElement
            | HTMLCanvasElement;
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(container);

        let data: number[] = [];
        let indicatorname: any = [];
        list.length &&
            list.forEach((item: any, index: number) => {
                if (index <= 4) {
                    data.push(item.value);
                    indicatorname.push(item.name);
                }
            });
        let maxdata = [100, 100, 100, 100, 100];

        function contains(arrays: any, obj: any) {
            let i = arrays.length;
            while (i--) {
                if (arrays[i] === obj) {
                    return i;
                }
            }
            return false;
        }

        let indicator: any = [];
        for (let i = 0; i < indicatorname.length; i++) {
            indicator.push({
                name: indicatorname[i],
                max: maxdata[i]
            });
        }

        function innerdata(i: number) {
            var innerdata = [];
            for (let j = 0; j < data.length; j++) {
                innerdata.push(100 - 20 * i);
            }
            return innerdata;
        }

        const optionData = getData(data);

        function getData(data: any) {
            let res: any = {
                series: [
                    {
                        type: 'radar',
                        symbolSize: 1,
                        symbol: 'circle',
                        areaStyle: {
                            color: 'rgba(24,167,188, .8)'
                        },
                        // lineStyle: {
                        //     color: 'rgba(24,167,188, 1)',
                        //     width: 1
                        // },
                        itemStyle: {
                            color: 'rgba(24,167,188, 1)',
                            borderColor: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: '#00DEFF'
                                    },
                                    {
                                        offset: 1,
                                        color: '#1598FF'
                                    }
                                ],
                                false
                            ),
                            borderWidth: 1,
                            opacity: 0.8
                        },
                        label: {
                            show: false
                        },
                        data: [
                            {
                                value: data
                            }
                        ],
                        z: 100
                    }
                ]
            };
            for (let i = 0; i < data.length; i++) {
                res.series.push({
                    type: 'radar',
                    data: [
                        {
                            value: innerdata(i)
                        }
                    ],
                    symbol: 'none',
                    itemStyle: {
                        color: 'rgba(38,124,170,1)',
                        width: 1
                    }
                    // areaStyle: {
                    //     color: 'transparent',
                    //     shadowColor: 'rgba(14,122,191,0.15)',
                    //     shadowBlur: 30,
                    //     shadowOffsetY: 20
                    // }
                });
            }
            return res;
        }

        const option: any = {
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                textStyle: { color: '#fff' },
                formatter: function () {
                    let html = '';
                    for (let i = 0; i < data.length; i++) {
                        let percent = data[i] > 100 ? 100 : data[i];
                        html += indicatorname[i] + ' : ' + percent + '<br>';
                    }
                    return html;
                }
            },
            radar: {
                center: ['50%', '55%'],
                indicator: indicator,
                axisLine: {
                    //指向外圈文本的分隔线样式
                    lineStyle: {
                        color: 'rgba(38,124,170,1)',
                        width: 1
                    }
                },
                splitLine: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(38,124,170,1)',
                        shadowBlur: 20,
                        shadowColor: 'rgba(255,255,255,1)'
                    }
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: 'transparent'
                    }
                },
                axisLabel: {
                    show: false
                },
                name: {
                    textStyle: {
                        rich: {
                            a: {
                                fontSize: '12',
                                color: '#fff',
                                align: 'center',
                                lineHeight: '16'
                            },
                            b: {
                                fontSize: '10',
                                color: '#fff',
                                align: 'center',
                                padding: [0, 0, 30, 0]
                            },
                            c: {
                                fontSize: '10',
                                color: '#fff',
                                align: 'center',
                                padding: [0, 0, -20, 0]
                            }
                        }
                    },

                    formatter: function (params: any, index: any) {
                        let i = contains(indicatorname, params);
                        let percent = data[i] > 100 ? 100 : data[i];
                        if (i === 0) {
                            return ' {c|' + params + '  ' + percent + '}';
                        }
                        const name = params.length > 10 ? params.slice(0, 10) + '...' : params;
                        return '{a|' + percent + '}\n' + '{b|' + name + '}';
                    }
                }
            },
            series: optionData.series
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    };
    return (
        <div
            className="pie-wrapper"
            id={canvasContainer}
            style={{ width: width, height: height }}
        />
    );
}
