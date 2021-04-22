import React, { useEffect, useState } from 'react';

export default function useSize() {
    const svgH = document.getElementById('container')?.offsetHeight;
    const screenWidth =
        window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
    const screenHeight =
        window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
    const commonWidth = 370;
    const [size, setSize] = useState({
        screenWidth: 0, // 屏幕分辨率width
        inputWidth: 480, // 搜素输入框的width
        inputHeight: 40, // 搜素输入框的height
        kgWidth: screenWidth - commonWidth * 2 - 30, // 动态计算：知识图谱svg width
        kgHeight: svgH, // 知识图谱svg height
        // kgWidth: 1100, // 知识图谱svg width
        // kgHeight: (svgH as number) - 80 || 924, // 知识图谱svg height
        kgAssNodeR: [60, 35], // 关系图谱的半径根据level匹配
        kgNodeR: [55, 40, 30, 20, 15, 10], // 资源图谱的半径根据level匹配
        kgAssNodeFontSize: [20, 14], // 关系图谱实体内字号
        kgNodeFontSize: [20, 14, 12, 10, 10, 10, 10], // 资源图谱使体内字号
        commonW: commonWidth, // 可视化容器公共width
        commonH: 150, // 可视化容器公共height
        subjectDistH: 270, // 学科次分布可视化容器高
        hotWordsH: 175, // 热词分布可视化容器高
        highCitedH: 75, // 高被引可视化容器高
        pieRadius: 55, // 饼图半径
        stringMaxLength: 8, // 可视化legend字符最大长度
        legendGap: 10,
        legendWidth: 130,
        resumeH: 110,
        wordCloudFontSizeRange: [12, 26] // 词云字号范围
    });
    useEffect(() => {
        console.log('分辨率：', `${window.screen.width} * ${window.screen.height}`);
    }, []);
    useEffect(() => {
        // const svgH: any = document.getElementById('container')?.offsetHeight;

        const calcSize = () => {
            // calc size

            console.log('视口宽===', `${screenWidth} * ${screenHeight}`);

            if (screenWidth <= 1280) {
                const commonWidth = 270;
                setSize({
                    screenWidth: 1280,
                    inputWidth: 380,
                    inputHeight: 35,
                    kgWidth: screenWidth - commonWidth * 2 - 30,
                    // kgWidth: 715,
                    // kgHeight: svgH - 95 || 680,
                    kgHeight: 630,
                    kgAssNodeR: [50, 25],
                    kgNodeR: [50, 35, 30, 16, 10, 8],
                    kgAssNodeFontSize: [14, 10],
                    kgNodeFontSize: [14, 12, 10, 10, 10, 10, 10],
                    commonW: commonWidth,
                    commonH: 129,
                    subjectDistH: 240,
                    hotWordsH: 125,
                    highCitedH: 56,
                    pieRadius: 45,
                    stringMaxLength: 6,
                    legendGap: 6,
                    legendWidth: 95,
                    resumeH: 100,
                    wordCloudFontSizeRange: [12, 22]
                });
            } else if (screenWidth <= 1440) {
                const commonWidth = 300;
                setSize({
                    screenWidth: 1440,
                    inputWidth: 420,
                    inputHeight: 40,
                    kgWidth: screenWidth - commonWidth * 2 - 30,
                    // kgWidth: 799,
                    // kgHeight: svgH - 100 || 760,
                    kgHeight: 730,
                    kgAssNodeR: [50, 30],
                    kgNodeR: [45, 35, 30, 20, 10, 8],
                    kgAssNodeFontSize: [18, 12],
                    kgNodeFontSize: [18, 14, 12, 10, 10, 10, 10],
                    commonW: commonWidth,
                    commonH: 150,
                    subjectDistH: 225,
                    hotWordsH: 135,
                    highCitedH: 70,
                    pieRadius: 50,
                    stringMaxLength: 6,
                    legendGap: 6,
                    legendWidth: 110,
                    resumeH: 100,
                    wordCloudFontSizeRange: [14, 24]
                });
            } else {
                // setSize({ ...size, screenWidth: 1920, kgHeight: svgH - 80 || 950 });
                setSize({ ...size, screenWidth: 1920, kgHeight: 805 });
            }
        };
        calcSize();
        window.addEventListener('resize', calcSize);
        return () => {
            window.removeEventListener('resize', calcSize);
        };
    }, [svgH]);

    return size;
}
