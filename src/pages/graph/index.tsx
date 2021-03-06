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
// ?????????????????????
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
    const [exampleList, setExampleList] = useState(exampleDefault); // ????????????
    const [activeExampleId, setActiveExampleId] = useState<string>(selectedId as string); // ????????????id
    const [showExample, setShowExample] = useState(false); // ????????????
    const [visualData, setVisualData] = useState<any>(); // ???????????????
    const [suggestInfo, setSuggestInfo] = useState<any>({
        list: [],
        loading: false
    });
    const refSelect = useRef<any>();
    // ????????????
    const [graphData, setGraphData] = useState<IGraphData | null>(null);
    const [filterType, setFilterType] = useState<string>('');

    //????????????:0 ???????????????:1
    const [activeGraph, setActiveGraph] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [queryValue, setQueryValue] = useState<ISearchParam>({
        entityId: '',
        entityName: '',
        entityType: ''
    });
    // ????????????EXPERT???ORG????????????????????????legend???
    const [graphTypes, setGraphTypes] = useState<string[]>([]);
    const [graphType, setGraphType] = useState<number>(0); //0:?????????1:????????????

    // modal?????????type:0 text?????????1html??????
    const [modalDate, setModalDate] = useState<any>({
        type: 0,
        title: '',
        content: [] || ''
    });

    useEffect(() => {
        // ????????????????????????modal/drawer
        window.addEventListener('click', function (event: any) {
            const exampleWrapper = document.getElementById('examples-words');
            const svg = document.getElementById('svg');
            const drawerEl = document.getElementsByClassName('ant-drawer-content')[0];
            // ?????????????????????????????????????????????
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
        // refSelect && refSelect.current && refSelect.current.focus();// ????????????
        inputSearchHandle(selectValue);
    }, []);

    useEffect(() => {
        // ??????????????????
        queryValue.entityId && getGraphData();
    }, [queryValue.entityId, activeGraph]);

    useEffect(() => {
        if (queryValue.entityId) {
            // ?????????????????????
            if (queryValue.entityType === 'EXPERT') {
                getExpertVisualData();
            } else if (queryValue.entityType === 'SUBJECT') {
                getSubjectVisualData();
            }
        }
    }, [queryValue.entityId]);

    useEffect(() => {
        // ????????????6????????????????????????IE??????
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

    // ??????????????????
    const getExamplesData = async () => {
        try {
            const params = { page: examplePage };
            const res = await baseApi.getExamples(params);
            setExampleList(res);
            if (res.length) {
                setShowExample(true);
            } else {
                message.warn('??????????????????');
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ??????????????????-??????:????????????
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
                // ????????????
                if (activeGraph === 0) {
                    res = await expertApi.getExpertGraph(params);
                } else {
                    // ????????????
                    res = await expertApi.getExpertResourceGraph(params);
                }
            } else if (queryValue.entityType === 'SUBJECT') {
                // ???????????????
                if (activeGraph === 0) {
                    // ????????????
                    res = await subjectApi.getSubjectGraph(params);
                } else {
                    // ????????????
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

    // ??????????????????
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

    //         // setGraphFilterData(result); // ????????????????????????
    //         console.log(result);
    //         return result;
    //     } else {
    //         // getGraphData();
    //         return data;
    //     }
    // };

    // ????????????????????????change handle(??????????????????list)
    const inputSearchHandle = (value: any): void => {
        value && fetchSuggest(value);
    };

    // ????????????list??????
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

    // ???????????????
    const fetchSuggest = debounce(getSuggestWords, 800);

    // ??????????????????????????????/?????????????????????????????????
    const selectSuggestWordHandle = (value: any) => {
        const params: any = JSON.parse(value);
        setQueryValue(params);
        // ?????????????????????????????????suggest?????????????????????select???????????????????????????????????????
        setSuggestInfo({
            list: [params],
            loading: false
        });
        // ?????????????????????????????????????????????active???
        setActiveExampleId('');
        robotMouseLeave();
        selectBlurHandle();
    };

    // ????????????modal
    const showExampleHandle = () => {
        if (!showExample) {
            // examplePage = 1;
            getExamplesData();
        } else {
            setShowExample(false);
        }
    };

    // ????????????
    const exampleClickHandle = (item: IExampleData, event: any): void => {
        const params = {
            entityId: item.entityId,
            entityName: item.entityName,
            entityType: item.entityType
        };
        setActiveExampleId(item.entityId);
        setShowExample(false);
        setQueryValue(params);
        // ?????????????????????????????????suggest?????????????????????select???????????????????????????????????????
        setSuggestInfo({
            list: [params],
            loading: false
        });
    };

    // ????????????
    const examplePageHandle = () => {
        examplePage = examplePage === 5 ? 1 : examplePage + 1;
        getExamplesData();
    };

    // ??????????????????
    const toggleGraphHandle = () => {
        setActiveGraph(activeGraph === 0 ? 1 : 0);
    };

    // ???????????????????????????
    const getExpertVisualData = async () => {
        // ????????????????????????
        setVisualData(null);
        try {
            const params = {
                expertId: queryValue.entityId
            };
            // ???????????????
            const res = await expertApi.getVisualData(params);
            setVisualData(res);
            // console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    // ??????????????????????????????
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

    // ??????????????????????????????
    const showDetailModal = (title: string, content: string) => {
        setModalDate({
            type: 1,
            title: title,
            content: content
        });
        setShowModal(true);
    };

    //????????????
    const backHome = () => {
        props.history.push('/');
    };

    // ?????????
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

    // ????????????????????????
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

    // ????????????????????????
    const getNodeLayerData = async (data: any) => {
        try {
            const params: any = {
                name: data?.name,
                id: data?.id, // ??????id
                type: data?.type // ????????????
            };
            const res = await baseApi.getNodeDetail(params);
            setShowDrawer(1);
            setClickedNodeInfo({ ...params, data: res });
        } catch (error) {
            console.log(error);
        }
    };

    // ????????????????????????????????????
    const clickResourceNodeHandle = (data: INode) => {
        getNodeLayerData(data);
        // ?????????????????????
        const nodeList = d3.selectAll('.node');
        nodeList.style('opacity', 0.2);
        const edgeList = d3.selectAll('.edge');
        const relationLabels = d3.selectAll('.edgelabel');
        if (data.id === selectedId) {
            // ??????????????????????????????
            nodeList.style('opacity', 1);
            edgeList.style('display', 'none');
            relationLabels.style('display', 'none');
            return;
        }
        edgeList.style('display', 'none');
        relationLabels.style('display', 'none');
        let nodeArr: any[] = [];
        let edgeFilters: any = [];
        // ????????????????????????????????????????????????
        highlightResourceNodes(data, edgeList, nodeArr, edgeFilters);

        const nodesFilter = nodeList.filter((item) => {
            return nodeArr.includes((item as INode).id);
        });

        // ????????????
        const labelFilter = relationLabels.filter((item: any) => {
            return item.target.id === data.id;
        });
        edgeFilters.map((item: any) => {
            item.style('display', '');
        });
        nodesFilter.style('opacity', 1);
        activeGraph === 0 && labelFilter.style('display', '');
    };

    // ??????
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

    // ??????????????????????????????????????????
    const clickNodeHandle = (data: INode) => {
        // ?????????????????????
        const nodeList = d3.selectAll('.node');
        const edgeList = d3.selectAll('.edge');
        const relationLabels = d3.selectAll('.edgelabel');
        getNodeLayerData(data);
        if (data.id === selectedId) {
            // ??????????????????????????????
            nodeList.style('opacity', 1);
            edgeList.style('display', 'none');
            relationLabels.style('display', 'none');
            return;
        }

        nodeList.style('opacity', 0.2);
        edgeList.style('display', 'none');
        relationLabels.style('display', 'none');

        // ???????????????????????????
        // const relationLabelsBg = d3.selectAll('feFlood');
        // relationLabelsBg.attr('flood-opacity', '0');

        const currentEdges = graphData?.relations.filter(
            ({ target }) => (target as INode).id === data.id
        );
        const centerRelationName = currentEdges ? currentEdges[0].relType : ''; // ???????????????????????????????????????

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
        // ????????????
        const labelFilter = relationLabels.filter((item) => {
            return (item as ILink).relType === centerRelationName;
        });

        // ?????????????????????
        // const labelBgFilter = relationLabelsBg.filter((item: any) => {
        //     return (item.target as INode).id === data.id;
        // });

        nodesFilter.style('opacity', 1);
        edgeFilter.style('display', '');
        selectedEntityType === 'EXPERT' && labelFilter.style('display', '');
        // labelBgFilter.attr('flood-opacity', 1);
    };

    // v3????????????
    const clickRelativeLabel = (data: any) => {
        // ??????????????????
        if (activeGraph === 0 && selectedEntityType === 'EXPERT') {
            getRelationLayerData(data);
        }
    };
    // ???????????????
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
    // ???????????????????????????
    const [publishType, setPublishType] = useState(0);
    const publishTypeChange = (val: any) => {
        setPublishType(val.target.value);
    };
    const [distributionType, setDistributionType] = useState(0);
    const distributionTypeChange = (val: any) => {
        setDistributionType(val.target.value);
    };

    // ??????????????????
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
            title: '????????????',
            content: {}
        });
        // ????????????????????????????????????????????????????????????
        page.current === 1 && expertList.length ? getRelationExpert() : null;
        setShowModal(true);
    };

    // ??????????????????
    const changeCurrentPage = (current: number, pageSize?: any): any => {
        setPage({
            current: current,
            pageSize: pageSize || 10,
            total: page.total
        });

        getRelationExpert(current, pageSize);
    };

    // ?????????????????????????????????
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
                title: '????????????',
                content: { list: res.expertDetailDomainDTOList }
            });
        } catch (error) {
            console.log(error);
        }
    };

    // ???????????????
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
                            <span>??????{graphData?.entityTotal || 0}???</span>
                            <span>??????{graphData?.relationTotal || 0}???</span>
                        </div>
                        {/* ?????????????????? */}
                        {/* {renderExpertInfo()} */}
                        {queryValue.entityType === 'EXPERT' && (
                            <ExpertInfo {...visualData} graphData={graphData} />
                        )}
                        {/* ?????? */}
                        {queryValue.entityType === 'SUBJECT' && (
                            <Encyclopedia
                                graphData={graphData}
                                visualData={visualData}
                                showMore={showDetailModal}
                                styles={commonStyles}
                            />
                        )}
                        {/* ???????????? */}
                        <SubjectDistribution
                            graphData={graphData}
                            visualData={visualData}
                            queryValue={queryValue}
                            styles={commonStyles}
                        />

                        {/* ???????????? */}
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
                                placeholder="??????????????????????????????????????????????????????"
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

                        {/* ?????????????????? */}
                        <div className={css['toggle-btn-group']}>
                            <Radio.Group value={activeGraph} onChange={toggleGraphHandle}>
                                <Radio.Button value={0}>????????????</Radio.Button>
                                <Radio.Button value={1}>????????????</Radio.Button>
                            </Radio.Group>
                        </div>

                        <div className={css['graph-filter']}>
                            <span className={css['filter-btn']} onClick={() => setShowFilter(true)}>
                                <img src={filterIcon} alt="" />
                                <i>??????</i>
                            </span>
                            {/* ??????&???????????? */}
                            {showFilter && !activeGraph && selectedEntityType === 'EXPERT' ? (
                                <FilterRelations
                                    getGraphData={getGraphData}
                                    selectedId={selectedId}
                                    selectValue={selectValue}
                                    selectedEntityType={selectedEntityType}
                                    setShowFilter={setShowFilter}
                                />
                            ) : null}
                            {/* ???????????????????????? */}
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
                            {/* ????????????????????????????????? */}
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
                            {/* ????????????????????????????????? */}
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

                        {/* ???????????? */}
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
                                ???????????????<i>{queryValue.entityName}</i>
                                ?????????{activeGraph ? '??????' : '??????'}
                                ????????????????????????????????????????????????
                            </p>
                        )}
                    </div>

                    <div className={classnames(css['aside-right-wrapper'], css['aside-wrapper'])}>
                        <div className={css['statistics-wrapper']}>
                            <span>
                                ??????
                                {(graphData?.relations?.length && visualData?.literatureTotal) || 0}
                                ???
                            </span>
                            <span>
                                ????????????
                                {(graphData?.relations?.length && visualData?.projectTotal) || 0}???
                            </span>
                        </div>
                        {/* ???????????? */}
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
                        {/* ??????????????? */}
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

                        {/* ???????????? */}
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

            {/* ??????modal */}
            <Modal
                title={modalDate?.title}
                visible={showModal}
                onOk={() => setShowModal(false)}
                onCancel={() => setShowModal(false)}
                footer={null}
                wrapClassName={css['modal-wrapper']}
                afterClose={closeModalHandle}
            >
                {/* ?????????????????????????????????html */}
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
                                    showTotal={(total) => `??? ${total} ???`}
                                    current={page.current}
                                    pageSize={page.pageSize}
                                    onChange={changeCurrentPage}
                                />
                            </div>
                        ) : null}
                    </>
                )}
            </Modal>
            {/* ????????????????????? */}
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
