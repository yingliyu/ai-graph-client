import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { LiteratureType } from '../../../models/search';
import useSize from '../../../hooks/size';
import { BAR_COLORS_LIGHT as colorList } from '../../../utils/constant';

interface PropsType {
    width: number;
    height: number;
    r: number;
    total: number;
    data: LiteratureType[];
    canvasContainer: string;
    type?: string;
}

const Pie: React.FC<PropsType> = (props) => {
    const { stringMaxLength, legendWidth, legendGap } = useSize();
    const { width, height, r, total, data, canvasContainer, type } = props;

    useEffect(() => {
        drawPie();
    }, [stringMaxLength, total]);
    const dataStyle = {
        normal: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            }
            // shadowBlur: 30,
            // shadowColor: 'rgba(40, 40, 40, 0.3)'
        }
    };

    const placeHolderStyle = {
        normal: {
            color: 'rgba(0,0,0,0)',
            label: {
                show: false
            },
            labelLine: {
                show: false
            }
        },
        emphasis: {
            color: 'rgba(0,0,0,0)'
        }
    };

    const drawPie = () => {
        const container = document.getElementById(canvasContainer) as
            | HTMLDivElement
            | HTMLCanvasElement;
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(container);
        const arrName = getArrayValue(data, 'name');
        // const arrValue = getArrayValue(data, "value");
        const objData = array2obj(data, 'name');
        const optionData3D = getData(data);
        // 常规饼图配置项
        let seriesData: any[] = [];
        if (data?.length) {
            for (let i = 0; i < data.length; i++) {
                seriesData.push(
                    {
                        data: data[i].value,
                        value: data[i].value,
                        name: data[i].name
                    },
                    {
                        value: 0,
                        name: '',
                        itemStyle: placeHolderStyle
                    }
                );
            }
        }

        const pieSeries = [
            {
                name: '重点学科匹配度',
                type: 'pie',
                // radius: ['35%', '55%'],
                radius: [r - 20, r],
                center: ['20%', '50%'],
                itemStyle: dataStyle,
                data: seriesData
            }
        ];
        // option
        const option: any = {
            title: {
                top: '30%',
                left: '10%',
                text: '',
                textStyle: {
                    color: '#333',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: 12
                },
                subtext: type === 'ring' ? '(占全部数\n\n据的5%)' : '',
                subtextStyle: {
                    color: '#333',
                    fontSize: 12
                }
            },
            //type === 'ring' ? '' : '',
            // backgroundColor: 'rgba(0,0,0,0.8)',
            color: type === 'ring' ? [] : colorList,
            tooltip: {
                show: true,
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0.7)',
                textStyle: { color: '#fff' },
                formatter: function (params: any) {
                    if (params.name && params.name !== 'invisible') {
                        // return total ? params.name + ': ' + Math.round(params.percent) + '%' : '0%';
                        return total
                            ? params.name + ':' + Math.round((params.data.data / total) * 100) + '%'
                            : 0 + '%';
                    }
                    return;
                }
            },
            legend: {
                show: true,
                icon: 'roundRect',
                top: 'center',
                left: '40%',
                data: arrName,
                itemGap: legendGap,
                itemWidth: 10,
                itemHeight: 10,
                formatter: function (name: any) {
                    const reg = /^[a-zA-Z]+$/;
                    const cReg = /^[\u4e00-\u9fa5]/;
                    const isChineseName = cReg.test(name?.trim());
                    let label = '';
                    let maxLength;
                    maxLength = isChineseName ? stringMaxLength : stringMaxLength * 1.8; // 每项显示文字个数
                    if (name.length > maxLength) {
                        label = name.slice(0, maxLength) + '...';
                    } else {
                        label = name;
                    }
                    const valuePercent: number = total
                        ? Math.round((objData[name].value / total) * 100)
                        : 0;
                    return '{name|' + label + '}{value|' + valuePercent + '%} ';
                },
                tooltip: {
                    show: true
                },
                textStyle: {
                    color: '#fff',
                    fontSize: 12,
                    lineHeight: 14,
                    rich: {
                        name: {
                            width: legendWidth
                        }
                    }
                }
            },
            series: type === 'ring' ? optionData3D.series : pieSeries
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    };

    const getArrayValue = (array: any, val: any) => {
        let key = val || 'value';
        let res: number[] = [];
        if (array) {
            array.forEach(function (t: any) {
                res.push(t[key]);
            });
        }
        return res;
    };

    const array2obj = (array: any, key: any) => {
        let resObj: any = {};
        for (let i = 0; i < array?.length; i++) {
            resObj[array[i][key]] = array[i];
        }

        return resObj;
    };

    const getData = (data: any) => {
        let list = [];
        for (let i = 0; i < data?.length; i++) {
            list.push(
                {
                    data: data[i].value,
                    value: data[i].value,
                    name: data[i].name
                },
                {
                    value: 0,
                    name: ''
                }
            );
        }

        let res: any = {
            series: [
                {
                    type: 'liquidFill',
                    itemStyle: {
                        normal: {
                            opacity: 0.4,
                            shadowBlur: 0,
                            shadowColor: 'blue'
                        }
                    },
                    name: '文献分布',
                    data: [
                        {
                            value: 0.6,
                            itemStyle: {
                                normal: {
                                    color: '#53d5ff',
                                    opacity: 0.6
                                }
                            }
                        }
                    ],
                    color: ['#53d5ff'],
                    center: ['20%', '50%'],
                    label: {
                        normal: {
                            formatter: '',
                            textStyle: {
                                fontSize: 12
                            }
                        }
                    },
                    outline: {
                        itemStyle: {
                            borderColor: '#86c5ff',
                            borderWidth: 0
                        },
                        borderDistance: 0
                    }
                },
                {
                    name: '文献领域分布',
                    type: 'pie',
                    // radius: [((i + 1) * pieRadius) / 5, ((i + 2) * pieRadius) / 5],
                    radius: ['48%', '75%'],
                    center: ['20%', '50%'],
                    // itemStyle: dataStyle,
                    data: list,
                    itemStyle: {
                        normal: {
                            color: function (params: any) {
                                return params.dataIndex % 2
                                    ? 'rgba(0,0,0,0)'
                                    : colorList[params.dataIndex / 2];
                            },
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false,
                                length: 80,
                                length2: 120
                            }
                        }
                    }
                }
            ]
        };

        return res;
    };

    return (
        <div
            className="pie-wrapper"
            id={canvasContainer}
            style={{ width: width, height: height }}
        />
    );
};

export default Pie;
