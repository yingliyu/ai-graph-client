import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Radio, message, Modal, Drawer, Skeleton, List, Avatar, Pagination } from 'antd';
import * as d3 from 'd3';
import classnames from 'classnames';
import css from './index.module.less';
import Header from './components/header';
import ExpertInfo from './components/expert-info';
import ExpertResume from './components/expert-resume';
import SubjectDistribution from './components/subject-distribution';
import LiteratureDistribution from './components/literature-distribution';
import JournalDistribution from './components/journal-distribution';
import SubjectMatch from './components/subject-match';
import HighCited from './components/high-cited';
import SubjectWord from './components/subject-word';
import Encyclopedia from './components/encyclopedia';
import PublishDistribution from './components/publish-distribution';
import RelevantExpert from './components/relevant-expert';
import Graph from '../../components/graph';
import SearchModel from './components/search';
import Sample from './components/sample';
import HotWords from './components/hot-words';
import debounce from 'lodash.debounce';
import NodeLayer from './components/node';
import RelationLayer from './components/relation';
import FilterRelations from './components/filter-relations';
import FilterTypes from './components/filter-types';
import { baseApi, expertApi, subjectApi } from '../../services';
import { IExampleData, ISearchParam } from '../../models/search';
import useSize from '../../hooks/size';
import {
    ALL_NODE_TYPES,
    COLOR_OBJ as colors,
    expertResourceNodeTypes,
    subjectRelationNodeTypes,
    subjectResourceNodeTypes
} from '../../utils/constant';
import { INode, ILink, IGraphComponentProps, IGraphData } from '../../models/graph';
const questionIco = require('./imgs/wenhaos.png');
const bgVideo = require('./imgs/video.mp4');
const robotImg = require('./imgs/robot.png');
const robotActiveImg = require('./imgs/robot_active.png');
const filterIcon = require('./imgs/filter.png');
// 示例默认第一页
let examplePage = 1;
const commonStyles = {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    marginTop: 10,
    border: '0px solid #0078FF'
};
interface IGraphProps {
    history: {
        push: any;
    };
    location: {
        search: string;
    };
}
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const GraphPage: React.FC<IGraphProps> = (props) => {
    const { commonW, inputWidth, inputHeight, kgWidth, kgHeight, resumeH } = useSize();
    const queryStr = useQuery();
    const selectValue: string = queryStr.get('q')!;
    const selectedId: string = queryStr.get('id')!;
    const selectedEntityType = queryStr.get('qt');
    const [showDrawer, setShowDrawer] = useState<number>(0);
    const exampleDefault: IExampleData[] = [];
    const [exampleList, setExampleList] = useState(exampleDefault); // 示例数据
    const [activeExampleId, setActiveExampleId] = useState<string>(selectedId as string); // 示例切换id
    const [showExample, setShowExample] = useState(false); // 示例状态
    const [visualData, setVisualData] = useState<any>(); // 可视化数据
    const [suggestInfo, setSuggestInfo] = useState<any>({
        list: [],
        loading: false
    });
    const refSelect = useRef<any>();
    // 图谱数据
    const [graphData, setGraphData] = useState<IGraphData | null>(null);
    const [filterType, setFilterType] = useState<string>('');

    //关系图谱:0 、资源图谱:1
    const [activeGraph, setActiveGraph] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [queryValue, setQueryValue] = useState<ISearchParam>({
        entityId: '',
        entityName: '',
        entityType: ''
    });
    // 图谱类型EXPERT、ORG等（用于展示图示legend）
    const [graphTypes, setGraphTypes] = useState<string[]>([]);
    const [graphType, setGraphType] = useState<number>(0); //0:关系，1:资源图谱

    // modal数据：type:0 text渲染，1html渲染
    const [modalDate, setModalDate] = useState<any>({
        type: 0,
        title: '',
        content: [] || ''
    });

    useEffect(() => {
        // 点击其他地方关闭modal/drawer
        window.addEventListener('click', function (event: any) {
            const exampleWrapper = document.getElementById('examples-words');
            const svg = document.getElementById('svg');
            const drawerEl = document.getElementsByClassName('ant-drawer-content')[0];
            // 点击图谱空白处图谱恢复默认状态
            if (svg && (svg as HTMLElement) === event.target) {
                const nodeList = d3.selectAll('.node');
                const edgeList = d3.selectAll('.edge');
                const relationLabels = d3.selectAll('.edgelabel');
                nodeList.style('opacity', 1);
                edgeList.style('display', 'none');
                relationLabels.style('display', 'none');
            }
            if (exampleWrapper && !(exampleWrapper as HTMLElement).contains(event.target)) {
                setShowExample(false);
            }
            if (drawerEl && !(drawerEl as HTMLElement).contains(event.target)) {
                setShowDrawer(0);
            }
        });

        const param: ISearchParam = {
            entityId: selectedId || '',
            entityName: selectValue || '',
            entityType: selectedEntityType || ''
        };

        selectedId && selectValue && setQueryValue(param);
        // refSelect && refSelect.current && refSelect.current.focus();// 默认聚焦
        inputSearchHandle(selectValue);
    }, []);

    useEffect(() => {
        // 更新图谱数据
        queryValue.entityId && getGraphData();
    }, [queryValue.entityId, activeGraph]);

    useEffect(() => {
        if (queryValue.entityId) {
            // 获取可视化数据
            if (queryValue.entityType === 'EXPERT') {
                getExpertVisualData();
            } else if (queryValue.entityType === 'SUBJECT') {
                getSubjectVisualData();
            }
        }
    }, [queryValue.entityId]);

    useEffect(() => {
        // 百科超出6行显示省略号兼容IE方案
        function ellipsizeTextBox(id: any) {
            var el: any = document.getElementById(id);
            if (el) {
                var wordArray = el ? el.innerHTML.split('') : '';
                while (el.scrollHeight > el.offsetHeight) {
                    wordArray.pop();
                    el.innerHTML = wordArray.join('') + '...';
                }
            }
        }
        ellipsizeTextBox('encyclopedia');
    }, [document.getElementById('encyclopedia')]);

    // 获取示例数据
    const getExamplesData = async () => {
        try {
            const params = { page: examplePage };
            const res = await baseApi.getExamples(params);
            setExampleList(res);
            if (res.length) {
                setShowExample(true);
            } else {
                message.warn('示例数据为空');
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 获取图谱数据-例如:人工智能
    const getGraphData = async (param?: any) => {
        props.history.push(
            `/graph?q=${queryValue.entityName}&id=${queryValue.entityId}&type=${activeGraph}&qt=${queryValue.entityType}`
        );
        const params = param
            ? param
            : {
                  entityId: queryValue.entityId,
                  entityName: queryValue.entityName
              };
        try {
            let res: IGraphData | null = null;
            if (queryValue.entityType === 'EXPERT') {
                // 专家图谱
                if (activeGraph === 0) {
                    res = await expertApi.getExpertGraph(params);
                } else {
                    // 资源图谱
                    res = await expertApi.getExpertResourceGraph(params);
                }
            } else if (queryValue.entityType === 'SUBJECT') {
                // 学科词图谱
                if (activeGraph === 0) {
                    // 关系图谱
                    res = await subjectApi.getSubjectGraph(params);
                } else {
                    // 资源图谱
                    res = await subjectApi.getSubjectResourceGraph(params);
                }
            }
            if (res) {
                // const data = nodeType ? filterGraphByType(res, nodeType!) : res;
                setGraphData(res);
                setGraphType(activeGraph);
                let types = new Set();
                res?.entities &&
                    res.entities.forEach((item: any) => {
                        types.add(item.type);
                    });
                const typesArr = Array.from(types) as string[];
                !graphTypes && setGraphTypes(typesArr); // only use in assosiation graph
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 筛选图谱数据
    // const filterGraphByType = (data: IGraphData, type?: string): IGraphData => {
    //     setFilterType(type!);
    //     if (type) {
    //         let nodeIds: string[] = [];

    //         const nodes: INode[] = data.entities.filter((node: INode) => {
    //             if (node.type === type || node.id === selectedId) {
    //                 nodeIds.push(node.id);
    //                 return node;
    //             }
    //         });

    //         const links = data.relations.filter((link: any) => nodeIds.includes(link.target));

    //         const result: IGraphData = {
    //             entities: nodes,
    //             relations: links,
    //             expertId: selectedId,
    //             expertName: selectValue,
    //             relationTotal: links?.length,
    //             entityTotal: nodes?.length
    //         };

    //         // setGraphFilterData(result); // 根据类型过滤图谱
    //         console.log(result);
    //         return result;
    //     } else {
    //         // getGraphData();
    //         return data;
    //     }
    // };

    // 关联监听输入框值change handle(获取关联下拉list)
    const inputSearchHandle = (value: any): void => {
        value && fetchSuggest(value);
    };

    // 获取关联list数据
    const getSuggestWords = async (val: string) => {
        setSuggestInfo({
            ...suggestInfo,
            loading: true
        });
        try {
            const res = await baseApi.getSuggestWords({ word: val });
            setSuggestInfo({
                list: res,
                loading: false
            });
        } catch (error) {
            setSuggestInfo({
                ...suggestInfo,
                loading: false
            });
        }
    };

    // 防抖、节流
    const fetchSuggest = debounce(getSuggestWords, 800);

    // 选中联想词中（学科词/专家）后触发的查询事件
    const selectSuggestWordHandle = (value: any) => {
        const params: any = JSON.parse(value);
        setQueryValue(params);
        // 将示例中搜索过的词带入suggest中，以便聚焦时select下拉框中能显示上次搜索的词
        setSuggestInfo({
            list: [params],
            loading: false
        });
        // 通过关联词搜索时要清掉示例当前active项
        setActiveExampleId('');
        robotMouseLeave();
        selectBlurHandle();
    };

    // 显示示例modal
    const showExampleHandle = () => {
        if (!showExample) {
            // examplePage = 1;
            getExamplesData();
        } else {
            setShowExample(false);
        }
    };

    // 示例点击
    const exampleClickHandle = (item: IExampleData, event: any): void => {
        const params = {
            entityId: item.entityId,
            entityName: item.entityName,
            entityType: item.entityType
        };
        setActiveExampleId(item.entityId);
        setShowExample(false);
        setQueryValue(params);
        // 将示例中搜索过的词带入suggest中，以便聚焦时select下拉框中能显示上次搜索的词
        setSuggestInfo({
            list: [params],
            loading: false
        });
    };

    // 示例分页
    const examplePageHandle = () => {
        examplePage = examplePage === 5 ? 1 : examplePage + 1;
        getExamplesData();
    };

    // 切换图谱类型
    const toggleGraphHandle = () => {
        setActiveGraph(activeGraph === 0 ? 1 : 0);
    };

    // 获取专家可视化数据
    const getExpertVisualData = async () => {
        // 清空上一次的数据
        setVisualData(null);
        try {
            const params = {
                expertId: queryValue.entityId
            };
            // 专家可视化
            const res = await expertApi.getVisualData(params);
            setVisualData(res);
            // console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    // 获取学科词可视化数据
    const getSubjectVisualData = async () => {
        setVisualData(null);
        try {
            const params = {
                subjectId: queryValue.entityId
            };
            const res = await subjectApi.getSubjectVisualData(params);
            setVisualData(res);
        } catch (error) {
            console.log(error);
        }
    };

    // 弹框展示履历等的详情
    const showDetailModal = (title: string, content: string) => {
        setModalDate({
            type: 1,
            title: title,
            content: content
        });
        setShowModal(true);
    };

    //返回首页
    const backHome = () => {
        props.history.push('/');
    };

    // 说明页
    const toQuestionPage = () => {
        // props.history.push('/explain');
        window.open('/explain', '_blank');
    };

    const [currentRelation, setCurrentRelation] = useState({
        relType: '',
        sourceName: '',
        targetType: '',
        data: ''
    });

    const [clickedNodeInfo, setClickedNodeInfo] = useState<any>({
        id: '',
        type: '',
        data: null,
        name: ''
    });

    // 获取关系浮层数据
    const getRelationLayerData = async (data: any) => {
        try {
            const params: any = {
                sourceId: data.source.id,
                targetId: data.target.id,
                targetName: data.target.name,
                targetType: data.target.type
            };
            const res = await expertApi.getExpertRelationDetail(params);
            setCurrentRelation({
                relType: data.relType,
                targetType: data.target.type,
                sourceName: data.source.name,
                data: res
            });
            setShowDrawer(2);
        } catch (error) {
            console.log(error);
        }
    };

    // 获取实体浮层数据
    const getNodeLayerData = async (data: any) => {
        try {
            const params: any = {
                name: data?.name,
                id: data?.id, // 实体id
                type: data?.type // 实体类型
            };
            const res = await baseApi.getNodeDetail(params);
            setShowDrawer(1);
            setClickedNodeInfo({ ...params, data: res });
        } catch (error) {
            console.log(error);
        }
    };

    // 资源图谱实体点击事件处理
    const clickResourceNodeHandle = (data: INode) => {
        getNodeLayerData(data);
        // 和中心词的关系
        const nodeList = d3.selectAll('.node');
        nodeList.style('opacity', 0.2);
        const edgeList = d3.selectAll('.edge');
        const relationLabels = d3.selectAll('.edgelabel');
        if (data.id === selectedId) {
            // 中心词只显示浮层信息
            nodeList.style('opacity', 1);
            edgeList.style('display', 'none');
            relationLabels.style('display', 'none');
            return;
        }
        edgeList.style('display', 'none');
        relationLabels.style('display', 'none');
        let nodeArr: any[] = [];
        let edgeFilters: any = [];
        // 筛选出点击词一直到中心词之间的线
        highlightResourceNodes(data, edgeList, nodeArr, edgeFilters);

        const nodesFilter = nodeList.filter((item) => {
            return nodeArr.includes((item as INode).id);
        });

        // 关系标签
        const labelFilter = relationLabels.filter((item: any) => {
            return item.target.id === data.id;
        });
        edgeFilters.map((item: any) => {
            item.style('display', '');
        });
        nodesFilter.style('opacity', 1);
        activeGraph === 0 && labelFilter.style('display', '');
    };

    // 递归
    const highlightResourceNodes = (node: any, lines: any, nodeArr: any[], edgeFilters: any) => {
        edgeFilters.push(
            lines.filter((item: any) => {
                if (item.target.id === node.id) {
                    nodeArr.push(item.target.id);
                    nodeArr.push(item.source.id);
                    if (item.source.id !== selectedId) {
                        highlightResourceNodes(item.source, lines, nodeArr, edgeFilters);
                    }
                }
                return item.target.id === node.id;
            })
        );
        return edgeFilters;
    };

    // 关系图谱实体点击事件事件处理
    const clickNodeHandle = (data: INode) => {
        // 和中心词的关系
        const nodeList = d3.selectAll('.node');
        const edgeList = d3.selectAll('.edge');
        const relationLabels = d3.selectAll('.edgelabel');
        getNodeLayerData(data);
        if (data.id === selectedId) {
            // 中心词只显示浮层信息
            nodeList.style('opacity', 1);
            edgeList.style('display', 'none');
            relationLabels.style('display', 'none');
            return;
        }

        nodeList.style('opacity', 0.2);
        edgeList.style('display', 'none');
        relationLabels.style('display', 'none');

        // 关系标签的滤镜底色
        // const relationLabelsBg = d3.selectAll('feFlood');
        // relationLabelsBg.attr('flood-opacity', '0');

        const currentEdges = graphData?.relations.filter(
            ({ target }) => (target as INode).id === data.id
        );
        const centerRelationName = currentEdges ? currentEdges[0].relType : ''; // 点击实体和中心词之间的关系

        const selectNodeIds: string[] = [selectedId as string];
        // let temp: any = {};
        graphData?.relations.forEach(({ target, relType }) => {
            // temp[relType] ? temp[relType]++ : (temp[relType] = 1);
            if (relType === centerRelationName) {
                selectNodeIds.push((target as INode).id);
            }
        });
        // console.log(temp);

        const nodesFilter = nodeList.filter((item) => {
            return selectNodeIds.includes((item as INode).id);
        });
        const edgeFilter = edgeList.filter((item) => {
            return (item as ILink).relType === centerRelationName;
        });
        // 关系标签
        const labelFilter = relationLabels.filter((item) => {
            return (item as ILink).relType === centerRelationName;
        });

        // 关系标签背景色
        // const labelBgFilter = relationLabelsBg.filter((item: any) => {
        //     return (item.target as INode).id === data.id;
        // });

        nodesFilter.style('opacity', 1);
        edgeFilter.style('display', '');
        selectedEntityType === 'EXPERT' && labelFilter.style('display', '');
        // labelBgFilter.attr('flood-opacity', 1);
    };

    // v3关系浮层
    const clickRelativeLabel = (data: any) => {
        // 专家关系图谱
        if (activeGraph === 0 && selectedEntityType === 'EXPERT') {
            getRelationLayerData(data);
        }
    };
    // 机器人状态
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [selectFocus, setSelectFocus] = useState(false);
    const robotMouseOver = () => {
        setMouseIsOver(true);
    };
    const robotMouseLeave = () => {
        setMouseIsOver(false);
    };
    const selectFocusHandle = () => {
        setSelectFocus(true);
    };
    const selectBlurHandle = () => {
        setSelectFocus(false);
    };
    // 可视化切换显示控制
    const [publishType, setPublishType] = useState(0);
    const publishTypeChange = (val: any) => {
        setPublishType(val.target.value);
    };
    const [distributionType, setDistributionType] = useState(0);
    const distributionTypeChange = (val: any) => {
        setDistributionType(val.target.value);
    };

    // 图谱筛选功能
    const [showFilter, setShowFilter] = useState<boolean>();

    interface IPageParam {
        current: number;
        pageSize: number;
        total: number;
    }
    const [page, setPage] = useState<IPageParam>({ current: 1, pageSize: 20, total: 1 });
    const [expertList, setExpertList] = useState([]);

    useEffect(() => {
        getRelationExpert();
    }, [selectedId]);

    const showRelationExpertModal = (data?: any) => {
        setModalDate({
            type: 0,
            title: '更多专家',
            content: {}
        });
        // 如果初始化时无数据，点击更多时就不调接口
        page.current === 1 && expertList.length ? getRelationExpert() : null;
        setShowModal(true);
    };

    // 专家列表翻页
    const changeCurrentPage = (current: number, pageSize?: any): any => {
        setPage({
            current: current,
            pageSize: pageSize || 10,
            total: page.total
        });

        getRelationExpert(current, pageSize);
    };

    // 弹框展示相关专家的详情
    const getRelationExpert = async (current?: number, pageSize?: number) => {
        try {
            const params: any = {
                type: selectedEntityType === 'EXPERT' ? 1 : 2,
                Id: selectedId,
                pageSize: pageSize ? pageSize : page.pageSize,
                pageNum: current ? current : page.current
            };
            const res = await baseApi.getRelationExperts(params);
            setPage({
                current: current ? current : page.current,
                pageSize: pageSize ? pageSize : page.pageSize,
                total: res.total
            });
            if (current === 1 || !current) {
                setExpertList(res.expertDetailDomainDTOList);
            }
            setModalDate({
                type: 0,
                title: '更多专家',
                content: { list: res.expertDetailDomainDTOList }
            });
        } catch (error) {
            console.log(error);
        }
    };

    // 关闭魔态框
    const closeModalHandle = () => {
        setShowModal(false);
        setPage({ current: 1, pageSize: 20, total: 1 });
    };
    return (
        <div className={css['graph-page-wrapper']}>
            <Header {...props} />
            <div className={css['container']}>
                <video className={css['banner-bgVideo']} autoPlay loop muted>
                    <source src={bgVideo} type="video/mp4" />
                </video>
                <div className={css['content']}>
                    {/* left aside */}
                    <div
                        id="container"
                        className={classnames(css['aside-left-wrapper'], css['aside-wrapper'])}
                    >
                        <div className={css['statistics-wrapper']}>
                            <span>实体{graphData?.entityTotal || 0}个</span>
                            <span>关系{graphData?.relationTotal || 0}个</span>
                        </div>
                        {/* 专家基本信息 */}
                        {/* {renderExpertInfo()} */}
                        {queryValue.entityType === 'EXPERT' && (
                            <ExpertInfo {...visualData} graphData={graphData} />
                        )}
                        {/* 百科 */}
                        {queryValue.entityType === 'SUBJECT' && (
                            <Encyclopedia
                                graphData={graphData}
                                visualData={visualData}
                                showMore={showDetailModal}
                                styles={commonStyles}
                            />
                        )}
                        {/* 学科分布 */}
                        <SubjectDistribution
                            graphData={graphData}
                            visualData={visualData}
                            queryValue={queryValue}
                            styles={commonStyles}
                        />

                        {/* 相关专家 */}
                        <RelevantExpert
                            // show={!!graphData?.relations?.length}
                            list={expertList}
                            styles={commonStyles}
                            showMore={showRelationExpertModal}
                        />
                    </div>
                    <div className={css['main-wrapper']}>
                        <i className={css['question-enter']} onClick={toQuestionPage}>
                            <img width="20px" src={questionIco}></img>
                        </i>
                        <div className={css['search-sample-wrapper']}>
                            <div
                                className={css['robot-wrapper']}
                                onMouseOver={robotMouseOver}
                                onMouseLeave={robotMouseLeave}
                            >
                                {mouseIsOver || selectFocus ? (
                                    <img
                                        width="70px"
                                        src={robotActiveImg}
                                        style={{
                                            position: 'relative',
                                            top: '-1px',
                                            left: '0.15px'
                                        }}
                                    />
                                ) : (
                                    <img width="70px" src={robotImg} />
                                )}
                            </div>
                            <SearchModel
                                height={inputHeight}
                                placeholder="请输入搜索词并在下拉菜单选择知识图谱"
                                value={queryValue.entityName}
                                refSelect={refSelect}
                                focusHandle={selectFocusHandle}
                                blurHandle={selectBlurHandle}
                                mouseEnterHandle={robotMouseOver}
                                mouseLeaveHandle={robotMouseLeave}
                                suggestInfo={suggestInfo}
                                fetchSuggest={fetchSuggest}
                                selectSuggestWordHandle={selectSuggestWordHandle}
                                {...props}
                            />
                            <Sample
                                ifExample={true}
                                showExample={showExample}
                                activeExampleId={activeExampleId}
                                exampleList={exampleList}
                                showExampleHandle={showExampleHandle}
                                exampleClickHandle={exampleClickHandle}
                                examplePageHandle={examplePageHandle}
                                setShowExample={setShowExample}
                                {...props}
                            />
                        </div>

                        {/* 图谱切换按钮 */}
                        <div className={css['toggle-btn-group']}>
                            <Radio.Group value={activeGraph} onChange={toggleGraphHandle}>
                                <Radio.Button value={0}>关系图谱</Radio.Button>
                                <Radio.Button value={1}>资源图谱</Radio.Button>
                            </Radio.Group>
                        </div>

                        <div className={css['graph-filter']}>
                            <span className={css['filter-btn']} onClick={() => setShowFilter(true)}>
                                <img src={filterIcon} alt="" />
                                <i>筛选</i>
                            </span>
                            {/* 类型&关系筛选 */}
                            {showFilter && !activeGraph && selectedEntityType === 'EXPERT' ? (
                                <FilterRelations
                                    getGraphData={getGraphData}
                                    selectedId={selectedId}
                                    selectValue={selectValue}
                                    selectedEntityType={selectedEntityType}
                                    setShowFilter={setShowFilter}
                                />
                            ) : null}
                            {/* 资源图谱类型筛选 */}
                            {showFilter && activeGraph ? (
                                <FilterTypes
                                    data={expertResourceNodeTypes}
                                    getGraphData={getGraphData}
                                    selectedId={selectedId}
                                    selectValue={selectValue}
                                    selectedEntityType={selectedEntityType}
                                    setShowFilter={setShowFilter}
                                />
                            ) : null}
                            {/* 学科词关系图谱类型筛选 */}
                            {showFilter && selectedEntityType === 'SUBJECT' && !activeGraph ? (
                                <FilterTypes
                                    data={subjectRelationNodeTypes}
                                    getGraphData={getGraphData}
                                    selectedId={selectedId}
                                    selectValue={selectValue}
                                    selectedEntityType={selectedEntityType}
                                    setShowFilter={setShowFilter}
                                />
                            ) : null}
                            {/* 学科词资源图谱类型筛选 */}
                            {/* {showFilter && selectedEntityType === 'SUBJECT' && activeGraph ? (
                                <FilterTypes
                                    data={subjectResourceNodeTypes}
                                    getGraphData={getGraphData}
                                    selectedId={selectedId}
                                    selectValue={selectValue}
                                    selectedEntityType={selectedEntityType}
                                    setShowFilter={setShowFilter}
                                />
                            ) : null} */}
                        </div>

                        {/* 知识图谱 */}
                        {graphData?.relations.length ? (
                            <Graph
                                svgWidth={kgWidth}
                                svgHeight={kgHeight}
                                {...props}
                                filterType={filterType}
                                data={graphData!}
                                allNodeTypes={ALL_NODE_TYPES}
                                nodeColors={colors}
                                graphType={activeGraph}
                                graphLegendType={graphType}
                                clickResourceNodeHandle={clickResourceNodeHandle}
                                clickNodeHandle={clickNodeHandle}
                                clickRelativeLabel={clickRelativeLabel}
                            />
                        ) : (
                            <p className={css['no-graph-desc']} style={{ width: inputWidth + 60 }}>
                                未搜索到与<i>{queryValue.entityName}</i>
                                相关的{activeGraph ? '资源' : '关系'}
                                图谱，换一个筛选条件或词试试吧！
                            </p>
                        )}
                    </div>

                    <div className={classnames(css['aside-right-wrapper'], css['aside-wrapper'])}>
                        <div className={css['statistics-wrapper']}>
                            <span>
                                文献
                                {(graphData?.relations?.length && visualData?.literatureTotal) || 0}
                                篇
                            </span>
                            <span>
                                科研项目
                                {(graphData?.relations?.length && visualData?.projectTotal) || 0}个
                            </span>
                        </div>
                        {/* 专家履历 */}
                        {/* {renderExpertResume()} */}
                        {queryValue.entityType === 'EXPERT' && (
                            <ExpertResume
                                width={commonW}
                                height={resumeH}
                                {...visualData}
                                graphData={graphData}
                                styles={commonStyles}
                                showMore={showDetailModal}
                            />
                        )}
                        {queryValue.entityType === 'EXPERT' && (
                            <HighCited
                                graphData={graphData}
                                visualData={visualData}
                                styles={commonStyles}
                            />
                        )}
                        {/* <LiquidFill /> */}
                        {/* 学科词显示 */}
                        {queryValue.entityType === 'SUBJECT' && (
                            <SubjectWord visualData={visualData} styles={commonStyles} />
                        )}

                        {queryValue.entityType === 'SUBJECT' && (
                            <LiteratureDistribution
                                graphData={graphData}
                                visualData={visualData}
                                styles={commonStyles}
                            />
                        )}
                        {queryValue.entityType === 'EXPERT' && (
                            <SubjectMatch
                                graphData={graphData}
                                visualData={visualData}
                                styles={commonStyles}
                                onChange={distributionTypeChange}
                                type={distributionType}
                            />
                        )}
                        {/* <Ring /> */}
                        <JournalDistribution
                            graphData={graphData}
                            visualData={visualData}
                            styles={commonStyles}
                        />

                        {queryValue.entityType === 'SUBJECT' && (
                            <PublishDistribution
                                graphData={graphData}
                                visualData={visualData}
                                styles={commonStyles}
                                onChange={publishTypeChange}
                                type={publishType}
                            />
                        )}

                        {/* 热词分布 */}
                        {/* {queryValue.entityType === 'EXPERT' && ( */}
                        <HotWords
                            graphData={graphData}
                            visualData={visualData}
                            queryValue={queryValue}
                            styles={commonStyles}
                        />
                        {/* )} */}
                    </div>
                </div>
            </div>

            {/* 履历modal */}
            <Modal
                title={modalDate?.title}
                visible={showModal}
                onOk={() => setShowModal(false)}
                onCancel={() => setShowModal(false)}
                footer={null}
                wrapClassName={css['modal-wrapper']}
                afterClose={closeModalHandle}
            >
                {/* 有带标签的情况，渲染为html */}
                {modalDate.type ? (
                    <p
                        style={{ color: '#000' }}
                        dangerouslySetInnerHTML={{ __html: modalDate?.content }}
                    ></p>
                ) : (
                    <>
                        <List
                            className="demo-loadmore-list"
                            itemLayout="horizontal"
                            dataSource={modalDate?.content.list}
                            renderItem={(item: any) => (
                                <List.Item>
                                    <Skeleton avatar title={false} loading={item.loading} active>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.phone} />}
                                            title={
                                                item.click ? (
                                                    <a
                                                        target="_blank"
                                                        href={`/graph?q=${
                                                            item.nameCh ? item.nameCh : item.nameEn
                                                        }&id=${item.expertId}&type=0&qt=EXPERT`}
                                                    >
                                                        {item.nameCh ? item.nameCh : item.nameEn}
                                                    </a>
                                                ) : (
                                                    <span>
                                                        {' '}
                                                        {item.nameCh ? item.nameCh : item.nameEn}
                                                    </span>
                                                )
                                            }
                                            description={null}
                                        />
                                        <div className={css['org-name']}>{item.org}</div>
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                        {expertList.length ? (
                            <div className={css['page-wrapper']}>
                                <Pagination
                                    size="small"
                                    showQuickJumper
                                    total={page.total}
                                    showTotal={(total) => `共 ${total} 位`}
                                    current={page.current}
                                    pageSize={page.pageSize}
                                    onChange={changeCurrentPage}
                                />
                            </div>
                        ) : null}
                    </>
                )}
            </Modal>
            {/* 实体及关系浮层 */}
            <div id="layerDrawer">
                <Drawer
                    className={css['layer-drawer']}
                    width={commonW + 20}
                    mask={false}
                    placement="right"
                    onClose={() => setShowDrawer(0)}
                    visible={!!showDrawer}
                    maskStyle={{ background: 'none' }}
                    bodyStyle={{ padding: 0 }}
                    getContainer={false}
                    drawerStyle={{ background: '#aa9fff', color: '#fff' }}
                >
                    {showDrawer === 1 && <NodeLayer {...clickedNodeInfo} />}
                    {showDrawer === 2 && <RelationLayer {...currentRelation} {...props} />}
                </Drawer>
            </div>
        </div>
    );
};
export default GraphPage;
