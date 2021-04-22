import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import useSize from '../../../hooks/size';
import { LiteratureType } from '../../../models/search';
import {
    BAR_COLORS_LIGHT as colorList,
    BAR_COLORS_DRAK as colorListDrak
} from '../../../utils/constant';
interface PropsType {
    width: number;
    height: number;
    name?: string;
    data: LiteratureType[];
    canvasContainer: string;
    showYAxis?: boolean; // 是否显示y轴
    showLegend?: boolean; // 是否Legend
    barBorderRadius?: number;
    grid?: { [propName: string]: any };
    align?: string; // 垂直vertical or 水平柱状图herizon
}

let colors: any[] = [];
colorList.forEach((item, index) => {
    colors.push({
        type: 'linear',
        x: 0,
        x2: 1,
        y: 0,
        y2: 0,
        colorStops: [
            {
                offset: 0,
                color: item
            },
            {
                offset: 0.5,
                color: item
            },
            {
                offset: 0.5,
                color: colorListDrak[index]
            },
            {
                offset: 1,
                color: colorListDrak[index]
            }
        ]
    });
});

const Bar: React.FC<PropsType> = (props) => {
    const {
        width,
        height,
        data,
        canvasContainer,
        barBorderRadius = 0,
        showYAxis = false,
        showLegend = true,
        grid,
        align
    } = props;

    const { stringMaxLength, legendGap, legendWidth } = useSize();

    useEffect(() => {
        drawBar();
    }, [stringMaxLength, data]);

    const drawBar = () => {
        const container = document.getElementById(canvasContainer) as
            | HTMLDivElement
            | HTMLCanvasElement;
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(container);
        const nameArr = getArrayValue(data, 'name');
        const valueArr = getArrayValue(data, 'value');
        // 水平柱状图的最大值
        // const salvProMax = new Array(nameArr.length).fill(Math.max(...valueArr));
        // console.log(salvProMax);
        const barWidth = 15;

        // 水平柱状图
        const seriesHerizon = [
            {
                type: 'bar',
                barWidth: barWidth,
                zlevel: 2,
                barGap: '-100%' /* 多个并排柱子设置柱子之间的间距 */,
                itemStyle: {
                    normal: {
                        barBorderRadius: barBorderRadius,
                        color: (params: any) => colorList[params.dataIndex]
                    }
                },
                data: data
            },
            {
                name: 'total',
                type: 'bar',
                barWidth: barWidth,
                barGap: '-100%',
                data: [1, 1],
                zlevel: 0,
                itemStyle: {
                    normal: {
                        color: 'rgba(255,255,255,0.1)',
                        barBorderRadius: barBorderRadius
                    }
                }
            }
        ];
        // 垂直柱状图
        const seriesVertical = [
            {
                barWidth: barWidth,
                width: 0,
                height: 0,
                type: 'pie',
                hoverAnimation: false,
                labelLine: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        color: (params: any) => colors[params.dataIndex]
                    }
                },
                data: data
            },
            {
                barWidth: barWidth,
                width: 0,
                height: 0,
                type: 'bar',
                hoverAnimation: false,
                labelLine: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        color: (params: any) => colors[params.dataIndex]
                    }
                },
                data: data
            },
            {
                z: 2,
                name: '',
                type: 'pictorialBar',
                data: data,
                symbol: 'diamond',
                symbolOffset: [0, '50%'],
                symbolSize: [barWidth, barWidth * 0.5],
                itemStyle: {
                    normal: {
                        color: function (params: any) {
                            return colors[params.dataIndex % 5];
                        }
                    }
                }
            },
            {
                z: 3,
                name: '',
                type: 'pictorialBar',
                symbolPosition: 'end',
                data: data,
                symbol: 'diamond',
                symbolOffset: [0, '-50%'],
                symbolSize: [barWidth, barWidth * 0.5],
                itemStyle: {
                    normal: {
                        borderWidth: 0,
                        color: function (params: any) {
                            return colors[params.dataIndex % 5].colorStops[0].color;
                        }
                    }
                }
            }
        ];

        // 横向柱状图tooltip
        const tooltip = {
            show: true,
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: [3, 5],
            textStyle: { color: '#fff' },
            formatter: function (params: any) {
                return params.seriesName === 'total'
                    ? ''
                    : `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${
                          params.color
                      }"/></span> ${params.name}: ${Math.round(params.value * 100)}%`;
            }
        };
        const legendData = data?.map((item) => item.name);

        let option: any = {
            legend: {
                show: showLegend,
                icon: 'roundRect',
                orient: 'vertical',
                top: 'center',
                left: '2%',
                data: legendData,
                // itemGap: legendGap,
                itemWidth: 10,
                itemHeight: 10,
                formatter: function (name: any) {
                    const reg = /^[a-zA-Z]0-9+$/;
                    const cReg = /^[\u4e00-\u9fa5]/;
                    const isChineseName = cReg.test(name?.trim());
                    let target;
                    let index;
                    let label = '';
                    // 分别设置中英文长度
                    const maxLength = isChineseName ? stringMaxLength : stringMaxLength * 1.8;
                    if (name.length > maxLength) {
                        label = name.slice(0, maxLength) + '...';
                    } else {
                        label = name;
                    }
                    for (let i = 0, l = option.series[0].data.length; i < l; i++) {
                        if (option.series[0].data[i].name === name) {
                            target = option.series[0].data[i].value;
                            index = i < 6 ? i : 5;
                        }
                    }
                    return `{name| ${label}}{value${index}|  ${target}}`;
                },
                tooltip: {
                    show: true
                },
                textStyle: {
                    color: '#fff',
                    lineHeight: 14,
                    fontSize: 12,
                    rich: {
                        name: {
                            width: legendWidth - 18
                        }
                    }
                }
            },
            grid: grid,
            tooltip:
                align === 'herizon'
                    ? tooltip
                    : {
                          show: true,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          padding: [3, 5],
                          textStyle: { color: '#fff' }
                      },
            xAxis: {
                show: false,
                type: align === 'herizon' ? 'value' : 'category',
                axisLabel: {
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: 12
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0,0,0,0)'
                    }
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: [
                {
                    show: showYAxis,
                    type: align === 'herizon' ? 'category' : 'value',
                    textStyle: {
                        width: 0
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: align === 'herizon' ? true : false,
                        formatter: function (value: any) {
                            let maxLength = stringMaxLength; // 每项显示文字个数
                            let valLength = value.length; // X轴类目项的文字个数
                            if (valLength > maxLength) {
                                let temp = ''; // 每次截取的字符串
                                let start = 0; // 开始截取的位置
                                temp = value.substring(start, maxLength) + '...';
                                return temp;
                            } else {
                                return value;
                            }
                        },
                        textStyle: {
                            color: '#fff',
                            fontSize: 12
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },

                    data: nameArr
                },
                {
                    show: showYAxis,
                    type: align === 'herizon' ? 'category' : 'value',
                    axisTick: 'none',
                    axisLine: 'none',
                    axisLabel: {
                        formatter: function (value: any) {
                            let maxLength = 6; // 每项显示文字个数
                            let valLength = value.length; // X轴类目项的文字个数
                            if (valLength > maxLength) {
                                let temp = ''; // 每次截取的字符串
                                let start = 0; // 开始截取的位置
                                temp = value.substring(start, maxLength) + '...';
                                return temp;
                            } else {
                                // return (value * 100).toFixed(2) + '%';
                                return Math.round(value * 100) + '%';
                            }
                        },
                        textStyle: {
                            color: '#fff',
                            fontSize: 12
                        }
                    },
                    data: valueArr
                }
            ],
            series: align === 'herizon' ? seriesHerizon : seriesVertical
        };
        myChart.on('legendselectchanged', function (params: any) {
            option.legend.selected = params.selected;
            option.legend.selected[params.name] = true; //相当于取消点击事件
            myChart.setOption(option);
        });

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
    return (
        <div
            className="bar-wrapper"
            id={canvasContainer}
            style={{ width: width, height: height }}
        />
    );
};
export default Bar;
