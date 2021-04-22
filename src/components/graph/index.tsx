import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { message } from 'antd';
import { INode, ILink, IGraphComponentProps, INodeColor } from '../../models/graph';
import css from './index.module.less';

import useSize from '../../hooks/size';
const icon = require('./imgs/cd.png');
const Graph: React.FC<IGraphComponentProps> = (props) => {
    const { screenWidth, kgAssNodeR, kgAssNodeFontSize, kgNodeR, kgNodeFontSize } = useSize();
    const {
        data,
        filterType,
        svgWidth = 1100,
        svgHeight = 900,
        nodeColors,
        allNodeTypes,
        graphType,
        graphLegendType,
        clickResourceNodeHandle,
        clickNodeHandle,
        clickRelativeLabel
    } = props;
    const { entities: nodesData, relations: linksData, expertId, subjectId } = data;
    const simulationRef = useRef<d3.Simulation<INode, ILink>>();

    const svgData = {
        top: 20,
        left: 20
    };
    const [nodeTypes, setNodeTypes] = useState<string[]>([]); //实体类型是【 EXPERT 、ORG等 】

    useEffect((): void => {
        d3.selectAll('section svg').remove();
        if (linksData && linksData.length && svgHeight && screenWidth) {
            initSvg();
            initForceSimulation();
            getNodeTypes();
        }
    }, [data, screenWidth]);

    // init SVG
    const initSvg = () => {
        d3.select('#graphContainer')
            .append('svg')
            .attr('id', 'svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${svgData.top}, ${svgData.left})`);
    };

    // 关系图谱：获取实体本身具有的类型【 EXPERT 、ORG等 】
    const getNodeTypes = () => {
        let types = new Set();
        nodesData.forEach((item: any) => {
            types.add(item.type);
        });
        const typesArr = Array.from(types) as string[];
        setNodeTypes(typesArr);
    };

    // 实体类型是【 EXPERT 、ORG等 】
    // const getResourceNodeTypes = () => {
    //     let types = new Set();
    //     nodesData.forEach((item: any) => {
    //         types.add(item.groupId);
    //     });
    //     const typesArr = Array.from(types) as string[];
    //     setNodeTypes(typesArr);
    // };

    // drag start event
    const started = (d: INode) => {
        if (!d3.event.active) {
            simulationRef &&
                simulationRef.current &&
                simulationRef.current.alphaTarget(0.3).restart();
        }
        d3.event.sourceEvent.stopPropagation();
        d.fx = d.x;
        d.fy = d.y;
    };

    // drag event
    const dragged = (d: INode) => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };

    // drag end event
    const ended = (d: INode) => {
        !d3.event.active &&
            simulationRef &&
            simulationRef.current &&
            simulationRef.current.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    };

    // set text position Y
    const setNodeTextPosition = (name: string, i: number, nodes: any) => {
        if (name) {
        }
        if (nodes.length === 1) {
            return '0em';
        } else if (nodes.length === 2) {
            if (i === 0) {
                return '-0.5em';
            } else if (i === 1) {
                return '0.5em';
            }
        } else if (nodes.length >= 3) {
            switch (i) {
                case 0:
                    return '-0.7em';
                case 1:
                    return '0.3em';
                case 2:
                    return '1.4em';
                default:
                    return '-9999999em';
            }
        }
        return '';
    };
    // 设置实体内文字位置
    const setSmallNodeTextPosition = (name: string, i: number, nodes: any) => {
        if (name) {
        }
        if (nodes.length === 1) {
            return '0em';
        } else if (nodes.length === 2) {
            if (i === 0) {
                return '-0em';
            } else if (i === 1) {
                return '-99999em';
            }
        } else if (nodes.length >= 3) {
            switch (i) {
                case 0:
                    return '0em';
                case 1:
                    return '-99999em';
                case 2:
                    return '-99999em';
                default:
                    return '-99999em';
            }
        }
        return '';
    };
    // 中文裁切
    const getSliceWord = (name: string) => {
        // 大多数是中文情况超过4不大于8两行显示，大于等于8显示...
        if (name.length > 4 && name.length <= 8) {
            return [name.slice(0, 3), name.slice(3, 8)];
        } else if (name.length > 8) {
            return [name.slice(0, 3), name.slice(3, 8), '...'];
        } else if (name.length === 8) {
            return [name.slice(0, 3), name.slice(3, 8)];
        } else {
            return [name];
        }
    };
    // draw relation lines
    const drewLines = () => {
        // 绘制关系线
        const edges = d3
            .select('svg g')
            .append('g')
            .attr('class', 'lines')
            .selectAll('line')
            .data(linksData)
            .enter()
            .append('line')
            .attr('class', 'edge')
            .attr('stroke', (d: any) =>
                graphType
                    ? Object.values(nodeColors as INodeColor)[d.target.groupId * 1 + 1]
                    : (nodeColors as INodeColor)[d.target.type]
            )
            .attr('stroke-width', '1.5px')
            .style('display', 'none');
        // edges.append('title').text((data) => data.label);
        return edges;
    };

    // draw nodes (circle & text)
    const drawNodes = () => {
        const nodes = d3
            .select('svg g')
            .append('g')
            .attr('class', 'nodes')
            .selectAll('.node')
            .data(nodesData)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('name', (data) => data.name)
            .call(
                d3
                    .drag<SVGGElement, INode>()
                    .on('start', started)
                    .on('end', ended)
                    .on('drag', dragged)
                    .on('end', ended)
            )
            .on('click', (d) => (graphType ? clickResourceNodeHandle(d) : clickNodeHandle(d)));

        nodes.append('title').text((data) => data.name);

        const circle = nodes
            .append('circle')
            .attr('class', 'circle-element')
            .attr('name', (d: any) => JSON.stringify(d))
            .attr('r', (d: INode) => (graphType ? kgNodeR[d.level] : kgAssNodeR[d.level]))
            .attr('fill', (d: any) =>
                graphType
                    ? d.id === expertId || d.id === subjectId
                        ? (nodeColors as INodeColor)['THEME']
                        : Object.values(nodeColors as INodeColor)[d.groupId * 1 + 1]
                    : (nodeColors as INodeColor)[d.type]
            )
            .attr('fill-opacity', (d: any) => {
                if (d.type === 'PAPER' || d.type === 'PATENT') {
                    return 0.2;
                }
                return 0.8;
            })
            .attr('stroke', (d: any) => {
                if (d.type === 'PAPER' || d.type === 'PATENT') {
                    return graphType
                        ? Object.values(nodeColors as INodeColor)[d?.groupId * 1 + 1]
                        : (nodeColors as INodeColor)[d.type];
                } else {
                    return null;
                }
            })
            .attr('stroke-width', 5)
            .attr('style', 'cursor: pointer;')
            .on('mouseover', function (d) {
                d3.select(this)
                    .transition()
                    .duration(250)
                    // .attr('style', 'stroke:rgba(0,0,0,0.2);stroke-width:5px;stroke-dasharray:1,1;');
                    .attr('r', (d: any) =>
                        graphType ? kgNodeR[d.level] + 6 : kgAssNodeR[d.level] + 6
                    );
            })
            .on('mouseout', function (d: INode) {
                d3.select(this)
                    .transition()
                    .duration(250)
                    .attr('r', (d: any) => (graphType ? kgNodeR[d.level] : kgAssNodeR[d.level]));
            });
        nodes
            .filter((d) => d.type === 'PAPER')
            .append('circle')
            .attr('class', 'circle-element')
            .attr('name', (d: any) => JSON.stringify(d))
            .attr('r', 8)
            .attr('fill', (d: any) =>
                graphType
                    ? Object.values(nodeColors as INodeColor)[d.groupId * 1 + 1]
                    : (nodeColors as INodeColor)[d.type]
            );

        nodes
            .append('text')
            .attr('class', 'node-text')
            .attr('fill', '#fff')
            .attr(
                'style',
                (d) =>
                    `cursor: pointer;text-anchor: middle;dominant-baseline: middle;font-size:${
                        graphType ? kgNodeFontSize[d.level] : kgAssNodeFontSize[d.level]
                    }px;`
            )
            .append('tspan')
            .selectAll('tspan')
            .data(({ name }) => {
                if (name) {
                    const reg = /^[a-zA-Z]+/gi;
                    const isEnglishName = reg.test(name.trim());
                    if (name.includes(' ')) {
                        if (isEnglishName) {
                            return name.split(' ');
                        } else {
                            return getSliceWord(name);
                        }
                    } else if (name.includes('.')) {
                        return name.split('.');
                    } else if (name.includes('-')) {
                        return name.split('-');
                    } else {
                        if (!isEnglishName) {
                            return getSliceWord(name);
                        } else {
                            return [name];
                        }
                    }
                }
                return [];
            })
            .join('tspan')
            .attr('fill', '#f1f1f1')
            .attr('x', 0)
            .attr('y', (name, i, nodes) =>
                // screenWidth === 1280
                //     ? setSmallNodeTextPosition(name, i, nodes)
                setNodeTextPosition(name, i, nodes)
            )
            .style('pointer-events', 'none')
            .text((name) => {
                const reg = /^[a-zA-Z]+/gi;
                const isEnglishName = reg.test(name);
                if (isEnglishName) {
                    return name.length > 6 ? `${name.slice(0, 6)}...` : name;
                } else {
                    return name.length > 5 ? `${name.slice(0, 5)}...` : name;
                }
            });

        return nodes;
    };

    // draw relation labels
    const drawEdgeLabel = () => {
        const edgepaths = d3
            .select('svg g')
            .append('g')
            .attr('class', 'paths')
            .selectAll('path') // make path go along with the link provide position for link labels
            .data(linksData)
            .enter()
            .append('path')
            .attr('class', 'edgepath')
            .attr('name', (d: any) => d.relType || '')
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
            .attr('id', (d, i) => d && 'edgepath' + i)
            .style('pointer-events', 'none');

        const edgelabels = d3
            .select('svg g')
            .append('g')
            .attr('class', 'tagLabels')
            .selectAll('.edgelabel')
            .data(linksData)
            .enter()
            .append('g')
            .attr('name', (d: any) => d.relType || '')
            .attr('class', 'edgeslabel-group')
            .attr('style', () =>
                expertId && !graphType ? 'cursor: pointer;' : 'pointer-events:none;'
            ) // 指定条件：专家关系图谱
            .on('click', (d) => clickRelativeLabel(d));

        edgelabels.append('title').text((data) => data.relType);

        // 文字背景
        // const edgeTextFilter = edgelabels
        //     .append('filter')
        //     .attr('name', (d: any) => d.relType || '')
        //     .attr('width', '1')
        //     .attr('height', '1')
        //     .attr('x', '0')
        //     .attr('y', '0')
        //     .attr('style', 'cursor: pointer;')
        //     .attr('class', 'filter')
        //     .attr('id', (d, i) => d && 'edgefilter_' + i)
        //     .on('click', (d) => console.log(d.relType + '关系'));

        // edgeTextFilter.append('feFlood').attr('flood-color', 'orange').attr('flood-opacity', '1');

        // edgeTextFilter
        //     .append('feComposite')
        //     .attr('in', 'SourceGraphic')
        //     .attr('operator', 'lighter');

        const edgeText = edgelabels
            .append('text')
            // .attr('style', `font-size:18px;`)
            .attr('class', 'edgelabel')
            .attr('id', (d, i) => d && 'edgelabel' + i)
            .attr('fill', '#fff')
            .attr('style', 'display:none;');

        const textPath = edgeText
            .append('textPath') // To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
            .attr('xlink:href', (d, i) => d && '#edgepath' + i)
            .style('text-anchor', 'middle')
            .style('pointer-events', 'none')
            .attr('startOffset', `${graphType ? '40%' : '50%'}`)
            // .attr('filter', (d, i) => d && 'url(#edgefilter_' + i + ')')
            .attr('style', `font-size:12px;`)
            .text(({ relType }) => relType || '')
            .on('mouseover', function (d) {
                if (expertId && !graphType) {
                    d3.select(this)
                        .transition()
                        .duration(350)
                        .attr('style', `font-size:16px;font-weight:bold;`);
                }
            })
            .on('mouseout', function (d) {
                if (expertId && !graphType) {
                    d3.select(this).transition().duration(350).attr('style', `font-size:12px;`);
                }
            });

        return edgepaths;
    };

    // create a force simulation
    const initForceSimulation = () => {
        try {
            // 创建一个弹簧力，根据 link 的 strength 值决定强度
            const linkForce = d3.forceLink<INode, ILink>(linksData).id((data: INode) => data.id);
            // .distance((d: any) => {
            //     if (graphType) {
            //         // return d;
            //         // return (10 - d.target.level * 2) * 20;
            //         // return d.target.level === 1 && d.source.level === 0 ? 2 : 50;
            //     } else {
            //         return kgAssNodeR[0] * 2;
            //     }
            // });

            const nodeCollision = d3
                .forceCollide()
                .radius((d: any) =>
                    graphType ? kgNodeR[d.level] * 1 + 6 : kgAssNodeR[d.level] * 1 + 8
                )
                .iterations(0.5)
                .strength(0.5);

            const nodeCharge = d3.forceManyBody().strength(-300).theta(0.01);
            const resourceNodeCharge = d3
                .forceManyBody()
                .strength((d: any) => -(9 - d.level) * 30)
                .theta(0.01)
                .distanceMin(35)
                .distanceMax(40);

            simulationRef.current = d3
                .forceSimulation<INode, ILink>(nodesData)
                .alpha(graphType ? 0.5 : 0.2) // 活力，渲染之后再自动动多久到达目标位置
                .force('link', linkForce) // 映射id & 线的长度
                .force('x', d3.forceX())
                .force('y', d3.forceY())
                .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
                // 避免节点相互覆盖
                .force('collision', nodeCollision)
                // 节点间相互排斥的电磁力
                .force('charge', graphType ? resourceNodeCharge : nodeCharge);

            simulationRef.current.nodes(nodesData).on('tick', () => {
                nodes
                    .attr('cx', (d: any) => {
                        if (d.level === 0) {
                            d.fx = svgWidth / 2;
                        }
                        return d.x;
                    })
                    .attr('cy', (d: any) => {
                        if (d.level === 0) {
                            d.fy = svgHeight / 2;
                        }
                        return d.y;
                    });

                edges
                    .attr('x1', ({ source }) => (source as INode).x || 0)
                    .attr('y1', ({ source }) => (source as INode).y || 0)
                    .attr('x2', ({ target }) => (target as INode).x || 0)
                    .attr('y2', ({ target }) => (target as INode).y || 0);
                nodes.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
                edgepaths.attr(
                    'd',
                    ({ target, source }) =>
                        'M ' +
                        (source as INode).x +
                        ' ' +
                        (source as INode).y +
                        ' L ' +
                        (target as INode).x +
                        ' ' +
                        (target as INode).y
                );
            });

            const edges = drewLines();
            const nodes = drawNodes();
            const edgepaths = drawEdgeLabel();
        } catch (error) {
            console.log(error);
            message.error('内部错误，' + JSON.stringify(error));
        }
    };
    return (
        <div className={css['graph-wrapper']}>
            {/* graph container */}
            <section id="graphContainer" style={{ width: svgWidth, height: svgHeight }} />
            {/* graph legend */}
            <ul className={css['legend-wrapper']}>
                {nodeTypes && nodeTypes.length && !graphLegendType
                    ? nodeTypes.map((item: any) => (
                          <li key={item}>
                              <i style={{ background: (nodeColors as INodeColor)[item] }} />
                              <span className={filterType === item ? css['active'] : css['']}>
                                  {allNodeTypes![item]}
                              </span>
                          </li>
                      ))
                    : null}
                {nodeTypes && nodeTypes.length && graphLegendType
                    ? nodeTypes.map(
                          (item: any) =>
                              item !== 'EXPERT' &&
                              item !== 'SUBJECT' && (
                                  <li key={item} className={css[item + '-ICON']}>
                                      <i>{item === 'PAPER' && <b />}</i>

                                      <span
                                          className={filterType === item ? css['active'] : css['']}
                                      >
                                          {allNodeTypes![item]}
                                      </span>
                                  </li>
                              )
                      )
                    : null}
            </ul>
        </div>
    );
};

export default Graph;
