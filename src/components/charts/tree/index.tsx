import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { BAR_COLORS_LIGHT as colorList } from '../../../utils/constant';

export default function TreeCharts(props: any) {
    const { width, height, data: list } = props;

    const dataC = JSON.parse(JSON.stringify(list)); // 拷贝
    let data: any = [];
    let flag = true; // 区分中心词专家还是学科词（专家默认根结点高亮）
    // 高亮中心词
    const heightlightKey = (data: any[]) => {
        const len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i].isKeyword) {
                data[i].label = { backgroundColor: '#7b6aff' };
                // data[i].label.backgroundColor = '#7b6aff';
                flag = false;
            } else {
                if (data[i].children) {
                    heightlightKey(data[i].children);
                }
            }
        }
        return data;
    };

    useEffect(() => {
        data = heightlightKey(dataC);
        if (flag) {
            data[0].label = { backgroundColor: '#7b6aff' };
        }
        drawTree();
    }, []);

    const drawTree = () => {
        const container = document.getElementById('tree') as HTMLDivElement | HTMLCanvasElement;
        // 基于准备好的dom，初始化echarts实例
        let myChart: any = echarts.init(container);
        const option: any = {
            color: colorList,
            title: {
                // text: '设为首图接口调用'
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'tree',
                    roam: false, //缩放功能
                    layout: 'orthogonal',
                    orient: 'LR',
                    // symbol: 'circle',
                    // symbolSize: 8,
                    symbolOffset: [-15, 0],
                    // edgeShape: 'polyline',
                    // edgeForkPosition: '20%',
                    top: 0,
                    bottom: 0,
                    left: 20,
                    right: 110,
                    initialTreeDepth: 2,
                    lineStyle: {
                        color: '#514C80',
                        curveness: 0.9,
                        type: 'solid',
                        width: 1
                    },
                    label: {
                        show: true,
                        position: 'insideBottomLeft',
                        color: '#fff',
                        backgroundColor: '#514C80',
                        borderRadius: 5,
                        padding: [3, 3],
                        offset: [5, 0],
                        fontSize: 12,
                        verticalAlign: 'middle',
                        formatter: (params: any) => {
                            const { name } = params;
                            let nameStr = '';
                            const ChineseReg = /^[\u4e00-\u9fa5]/;
                            if (ChineseReg.test(name)) {
                                name.split('').forEach((item: any) => {
                                    nameStr += `${item}\n`;
                                });
                                return name === data[0].name
                                    ? nameStr
                                    : name.length > 8
                                    ? name.slice(0, 8) + '...'
                                    : name;
                            } else {
                                return name.includes(' ')
                                    ? name.split(' ').join('\n')
                                    : name.length > 12
                                    ? name.slice(0, 12) + '...'
                                    : name;
                            }
                        }
                    },
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: '#514C80',
                        color: '#514C80'
                    },
                    emphasis: {
                        focus: 'descendant',
                        label: {
                            backgroundColor: '#7b6aff'
                        }
                    },
                    leaves: {
                        label: {
                            normal: {
                                // position: 'right',
                                // verticalAlign: 'middle',
                                // align: 'left'
                            }
                        }
                    },
                    // expandAndCollapse: false,
                    tooltip: {
                        confine: true,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        padding: [2, 5],
                        borderColor: 'rgba(0,0,0,0.6)',
                        textStyle: {
                            color: '#fff'
                        },
                        formatter: function (params: any) {
                            return params.name?.replace('/r/n', '<br />');
                        }
                    },
                    data: data,
                    animationDurationUpdate: 750
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    };

    return <div style={{ width: width, height: height + 50 }} id="tree"></div>;
}
