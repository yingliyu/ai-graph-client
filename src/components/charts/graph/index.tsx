import React, { useEffect } from 'react';
// 引入 ECharts 主模块
import * as echarts from 'echarts';
import { ICommonProps } from '../../../models/global';

// type echartsOpType =
//     | echarts.EChartsResponsiveOption
//     | echarts.EChartOption<echarts.EChartOption<echarts.EChartOption.Series>>;
interface ISmallGraphCloud {
    list: ICommonProps[];
    width: number;
    height: number;
}
const EchartsGraph: React.FC<ISmallGraphCloud> = (props: ISmallGraphCloud) => {
    const { list, width, height } = props;

    const colorList = [
        '#2f83e4',
        '#6462cc',
        '#ff80a0',
        '#7ae677',
        '#fdc765',
        '#f27d51',
        '#23cbff',
        '#00e5c1',
        '#fdc765',
        '#50e1de',
        '#2f83e4'
    ];

    useEffect(() => {
        const renderGraph = () => {
            const echartsGraphDataTip: HTMLElement = document.getElementById(
                'dataTip'
            ) as HTMLElement;
            const echartsGraph: HTMLElement = document.getElementById(
                'echartsGraph'
            ) as HTMLElement;
            try {
                // 节点的name不能重复
                echartsGraphDataTip.style.display = 'none';
                const container = document.getElementById('echartsGraph') as
                    | HTMLDivElement
                    | HTMLCanvasElement;
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(container);
                let seriesList: any[];
                // 使用刚指定的配置项和数据显示图表。
                seriesList = [];
                if (list && list.length) {
                    list.forEach((item, index) => {
                        seriesList.push({
                            name: item.name,
                            label: {
                                show: true,
                                color: '#fff',
                                position: 'inside',
                                fontSize: 12,
                                formatter: function (params: any) {
                                    const name = params.data.name;
                                    let nameStr: string = '';
                                    let nameArr: string[] = [];
                                    if (name.includes(' ')) {
                                        nameArr = item.name
                                            .split(' ')
                                            .slice(0, 2)
                                            .map((item, index) => {
                                                return item.length > 5
                                                    ? item.slice(0, 5) + '...'
                                                    : item;
                                            });
                                        if (item.name.split(' ').length > 2) {
                                            nameStr = nameArr.join('\n') + '...';
                                        } else {
                                            nameStr = nameArr.join('\n');
                                        }
                                    } else {
                                        if (name.length > 4 && name.length <= 8) {
                                            nameStr =
                                                name.length > 4
                                                    ? name.slice(0, 4) + '\n' + name.slice(4, 8)
                                                    : name;
                                        } else if (name.length > 8) {
                                            nameStr =
                                                name.length > 4
                                                    ? name.slice(0, 4) +
                                                      '\n' +
                                                      name.slice(4, 8) +
                                                      '\n...'
                                                    : name;
                                        } else {
                                            nameStr = name;
                                        }
                                    }
                                    return nameStr;
                                }
                            },
                            value: item.value,
                            symbolSize: 45 * 1 + item.value * 10,
                            draggable: true,
                            itemStyle: {
                                normal: {
                                    // "shadowBlur": 100,
                                    shadowColor: colorList[index],
                                    color: colorList[index]
                                }
                            }
                        });
                    });
                }
                const option: any = {
                    // 图表标题
                    title: {
                        show: true, // 显示策略，默认值true,可选为：true（显示） | false（隐藏）
                        text: '', // 主标题文本，'\n'指定换行
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderColor: '#ccc', // 标题边框颜色
                        borderWidth: 0, // 标题边框线宽，单位px，默认为0（无边框）
                        padding: 5, // 标题内边距，单位px，默认各方向内边距为5，
                        // 接受数组分别设定上右下左边距，同css
                        itemGap: 10, // 主副标题纵向间隔，单位px，默认为10，
                        textStyle: {
                            fontSize: 18,
                            fontWeight: 'bolder',
                            color: '#333' // 主标题文字颜色
                        },
                        subtextStyle: {
                            color: '#aaa' // 副标题文字颜色
                        }
                    },
                    backgroundColor: '#1e2123',
                    tooltip: {
                        position: function (
                            point: any,
                            params: any,
                            dom: any,
                            rect: any,
                            size: any
                        ) {
                            // 固定在顶部
                            return [point[0], '10%'];
                        },
                        formatter: function (params: any) {
                            // 根据业务自己拓展要显示的内容
                            let res = '';
                            let name = params.data.label.name
                                ? params.data.label.name
                                : params.name;
                            let value = params.value;
                            res =
                                "<span><b style='display:inline-block;position:relative;left:-3px;top:-3px;width:5px;height:5px;border-radius:50%;background:" +
                                params.color +
                                "'></b>" +
                                name +
                                '</span><br/>相关度：' +
                                (value * 100).toFixed(2) +
                                '%';
                            return res;
                        }
                    },
                    animationDurationUpdate: function (idx: any) {
                        // 越往后的数据延迟越大
                        return idx * 100;
                    },
                    animationEasingUpdate: 'bounceIn',
                    color: ['#fff', '#fff', '#fff'],
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            force: {
                                repulsion: width !== 370 ? 55 : 90, // 节点之间的斥力因子
                                edgeLength: 8
                            },
                            roam: true,
                            label: {
                                normal: {
                                    show: true
                                }
                            },
                            data: seriesList
                            // categories: seriesList
                        }
                    ]
                };
                myChart.setOption(option, true);
            } catch (error) {
                echartsGraphDataTip.style.display = 'block';
                // message.warn('热词分布有重复数据，渲染失败');
            }
        };
        renderGraph();
    }, [list]);
    const topStyle: any = {
        width: '100%',
        position: 'absolute',
        top: 50,
        textAlign: 'center',
        fontSize: 12
    };
    return (
        <div style={{ position: 'relative' }}>
            <div id="echartsGraph" style={{ width: width, height: height, borderRadius: '5px' }} />
            <p id="dataTip" style={topStyle}>
                数据有重复，渲染失败
            </p>
        </div>
    );
};
export default EchartsGraph;
