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

const Ring: React.FC<PropsType> = (props) => {
    const { stringMaxLength, legendWidth, legendGap } = useSize();
    const { width, height, r, total, data: list, canvasContainer, type } = props;

    useEffect(() => {
        drawRing();
    }, [stringMaxLength, total]);

    const drawRing = () => {
        const container = document.getElementById(canvasContainer) as
            | HTMLDivElement
            | HTMLCanvasElement;
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(container);

        let data: any = [];
        let arrName: any = [];
        list.forEach((item, index) => {
            arrName.push(item.name);
            const value = Math.round((item.value * 100) / total);
            data.push({
                value: value === 0 ? 1 : value,
                name: item.name,
                label: {
                    color: '#fff'
                },
                itemStyle: { color: colorList[index] },
                emphasis: {
                    itemStyle: {}
                }
            });
        });

        function angleText(i: any, num: any) {
            //每个元素的角度
            var everyAngle = 360 / num;
            //文字现在所在的角度
            var currentAngle = i * everyAngle + everyAngle / 2;
            //文字所在模块的所占角度
            var currentArea = (i + 1) * everyAngle;

            if (currentAngle <= 90) {
                return -currentAngle;
            } else if (currentAngle <= 180 && currentAngle > 90) {
                return 180 - currentAngle;
            } else if (currentAngle < 270 && currentAngle > 180) {
                return 180 - currentAngle;
            } else if (currentAngle < 360 && currentAngle >= 270) {
                return 360 - currentAngle;
            }
        }

        //有值的色图的正切处理
        var data3 = [];
        data3 = JSON.parse(JSON.stringify(data));
        for (var i = 0; i < data3.length; i++) {
            // if (i === 0) {
            //     data3[i]['label']['color'] = '#333';
            //     data3[i]['itemStyle']['color'] = 'rgba(25, 255, 224)';
            //     data3[i]['emphasis']['itemStyle']['color'] = 'rgba(25, 255, 224)';
            //     data3[i]['label']['rotate'] = angleText(i, data3.length);
            // } else {
            data3[i]['label']['color'] = '#fff';
            data3[i]['itemStyle']['color'] = colorList[i];
            // data3[i]['emphasis']['itemStyle']['color'] = '#6A5ACD';
            data3[i]['label']['rotate'] = angleText(i, data3.length);
            // }
        }

        //最外层大圈的数据
        var data1 = [];

        data1 = JSON.parse(JSON.stringify(data));
        for (var i = 0; i < data1.length; i++) {
            data1[i].value = 1;
            data1[i]['label']['rotate'] = angleText(i, data1.length);
            if (i === 0) {
                data1[i]['label']['color'] = 'rgba(25, 255, 224)';
            }
        }

        //透明饼图的数据
        var data2 = [];

        for (var i = 0; i < data.length; i++) {
            if (i === 0) {
                data2.push({
                    value: 1,
                    itemStyle: {
                        color: 'rgba(25, 255, 224,0.05)'
                    }
                });
            } else {
                data2.push({
                    value: 1,
                    itemStyle: {
                        color: 'transparent'
                    }
                });
            }
        }

        const option: any = {
            color: colorList,
            tooltip: {
                show: true,
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: [3, 5],
                textStyle: { color: '#fff' },
                formatter: function (params: any) {
                    if (params.name && params.name !== 'invisible') {
                        return total
                            ? params.marker + params.name + ':' + params.data.value + '%'
                            : 0 + '%';
                    }
                    return;
                }
            },
            legend: {
                show: true,
                icon: 'roundRect',
                top: 'center',
                left: '42%',
                data: arrName,
                // itemGap: legendGap,
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
                    let target;

                    for (let i = 0, l = data.length; i < l; i++) {
                        if (data[i].name === name) {
                            target = data[i].value;
                        }
                    }
                    return '{name|' + label + '}{value|' + target + '%} ';
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
            // angleAxis: {
            //     show: false,
            //     interval: 1,
            //     type: 'category',
            //     data: []
            // },
            // // 中间画圈圈的坐标轴
            // radiusAxis: {
            //     show: false
            // },
            series: [
                {
                    type: 'pie',
                    center: ['22%', '50%'],
                    radius: ['75%', '80%'],
                    hoverAnimation: false,
                    itemStyle: {
                        color: 'transparent'
                    },
                    labelLine: {
                        normal: {
                            show: false,
                            length: 30,
                            length2: 55
                        }
                    },
                    label: false,
                    name: '文献分布',
                    data: data1
                },
                {
                    stack: 'a',
                    type: 'pie',
                    center: ['22%', '50%'],
                    radius: ['81%', '40%'],
                    roseType: 'area',
                    zlevel: 10,
                    itemStyle: {
                        // color: '#4169E1'
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#6A5ACD'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: 12,
                                color: '#333'
                            },
                            position: 'inside',
                            rotate: 30,
                            align: 'right',
                            fontWeight: 'bold',
                            formatter: '{c}%'
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    animation: false,
                    data: data3
                },
                {
                    type: 'pie',
                    zlevel: 9,
                    center: ['22%', '50%'],
                    radius: ['15%', '80%'],
                    selectedOffset: 0,
                    animation: false,
                    hoverAnimation: false,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2
                }
            ]
        };

        myChart.setOption(option);

        myChart.on('click', function (a: any) {
            //最外层的字体颜色重置变色
            for (var da1 = 0; da1 < option.series[0].data.length; da1++) {
                option.series[0].data[da1].label.color = '#fff';
            }

            //色圈的字体颜色和选中颜色重置
            for (var da2 = 0; da2 < option.series[1].data.length; da2++) {
                option.series[1].data[da2].itemStyle.color = colorList[da2];
                option.series[1].data[da2].label.color = '#fff';
                //hover颜色重置
                // option.series[1].data[da2].emphasis.itemStyle.color = '#6A5ACD';
            }

            //背景的透明饼图的重置
            for (var da3 = 0; da3 < option.series[2].data.length; da3++) {
                option.series[2].data[da3].itemStyle.color = 'transparent';
            }

            // option.series[1].data[a.dataIndex].itemStyle.color = 'rgba(25, 255, 224)';
            // option.series[1].data[a.dataIndex].label.color = '#333';
            //hover 颜色改变
            // option.series[1].data[a.dataIndex].emphasis.itemStyle.color = 'rgba(25, 255, 224)';
            // option.series[0].data[a.dataIndex].label.color = 'rgba(25, 255, 224)';
            option.series[2].data[a.dataIndex].itemStyle.color = 'rgba(25, 255, 224,0.1)';
            //console.log(option)
            myChart.setOption(option);
        });

        myChart.on('mouseover', function (a: any) {
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 1,
                dataIndex: a.dataIndex
            });
        });

        myChart.on('mouseout', function (a: any) {
            myChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 1,
                dataIndex: a.dataIndex
            });
        });

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
};

export default Ring;
