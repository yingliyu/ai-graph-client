import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { ICommonProps } from '../../models/global';
import { WORD_CLOUD_COLORS } from '../../utils/constant';
// const bg = require('./logo.png');
interface IWordCloud {
    list: ICommonProps[];
    width: number;
    height: number;
    fontSizeRange: number[];
    canvasContainer?: string;
}
const WordCloud: React.FC<IWordCloud> = (props: IWordCloud) => {
    const { list, width, height, fontSizeRange, canvasContainer } = props;
    useEffect(() => {
        drawWordCloud();
    }, [list]);

    const drawWordCloud = () => {
        if (!list || !list.length) {
            return;
        }
        const wordElement = document.getElementById(canvasContainer as string);
        let chart = echarts.init(wordElement as HTMLDivElement);
        let data = [];
        for (let index in list) {
            const name = list[index].name;
            const nameArr = name.split(' ');
            const newName = nameArr[0];
            const nameStr = name.length > 6 ? name.slice(0, 6) : name;
            data.push({
                name: name.includes(' ') ? newName : nameStr,
                text: name,
                value: Math.sqrt(list[index].value)
            });
        }

        let maskImage = new Image();
        // maskImage.src = bg;
        // console.log(bg);

        let option = {
            tooltip: {
                formatter: (params: any) => params.data.text,
                backgroundColor: 'rgba(0,0,0,0.6)',
                textStyle: {
                    color: '#fff',
                    fontSize: 14
                }
            },
            series: [
                {
                    type: 'wordCloud',
                    left: 'center',
                    top: 'center',
                    width: '100%',
                    height: '100%',
                    right: null,
                    bottom: null,
                    sizeRange: fontSizeRange, // 字号
                    rotationRange: [-90, 90],
                    rotationStep: 90,
                    gridSize: fontSizeRange[0] - 2,
                    shape: 'star', // diamond/triangle/circle/pentagon/star
                    // maskImage: maskImage,
                    // textPadding: 0,
                    autoSize: {
                        enable: true,
                        minSize: 12
                    },
                    drawOutOfBound: false,
                    textStyle: {
                        normal: {
                            // fontFamily: '微软雅黑',
                            // fontWeight: 'normal',
                            // Color can be a callback function or a color string
                            color: function () {
                                // Random color
                                return WORD_CLOUD_COLORS[Math.floor(Math.random() * 3)];
                            }
                        },
                        emphasis: {
                            shadowBlur: 2,
                            shadowColor: '#1890ff'
                            // fontSize: 12
                        }
                    },
                    // data: data
                    data: data.sort(function (a: any, b: any) {
                        return b.value - a.value;
                    })
                }
            ]
        };
        chart.setOption(option);
    };

    return <div id={canvasContainer} style={{ height: height, width: width }} />;
};

export default WordCloud;
