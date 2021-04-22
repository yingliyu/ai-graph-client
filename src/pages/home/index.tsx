import React, { useState, useRef } from 'react';
import css from './index.module.less';
import Search from '../graph/components/search';
import { baseApi } from '../../services';
import debounce from 'lodash.debounce';
import useSize from '../../hooks/size';
import { Link } from 'react-router-dom';
const paperIco = require('./imgs/paper.png');
const patentIco = require('./imgs/patent.png');
const orgIco = require('./imgs/org.png');
const resultIco = require('./imgs/award.png');
const expertIco = require('./imgs/expert.png');
interface IHomeProps {
    history: {
        push: any;
    };
    location: {
        search: string;
    };
}
const Home: React.FC<IHomeProps> = (props) => {
    const { inputWidth, inputHeight } = useSize();
    const refSelect = useRef<any>();
    const [value, setValue] = useState<string | undefined>();
    const [suggestInfo, setSuggestInfo] = useState<any>({
        list: [],
        loading: false
    });

    // 获取关联list数据
    const getSuggestWords = async (val: string) => {
        val.trim() ? setValue(val) : setValue(undefined);
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
        // setQueryValue(params);
        // 将示例中搜索过的词带入suggest中，以便聚焦时select下拉框中能显示上次搜索的词
        setSuggestInfo({
            list: [params],
            loading: false
        });
        props.history.push(
            `/graph?q=${params.entityName}&id=${params.entityId}&type=0&qt=${params.entityType}`
        );
    };

    return (
        <div className={css['home-page-wrapper']}>
            <div className={css['home-main']}>
                <header>
                    <h2>上海人工智能公共研发资源图谱</h2>
                    <p>
                        整合数亿条全球优质学术资源，涵盖计算机领域专家、论文、专利、机构、科研项目、期刊等
                        多种形态资源，与科研工作者共同探索数据的奥妙。
                    </p>
                </header>
                <div className={css['search-container']}>
                    <Search
                        width={inputWidth}
                        height={inputHeight}
                        placeholder="请输入您要查询的专家或学科词"
                        value={value}
                        refSelect={refSelect}
                        suggestInfo={suggestInfo}
                        fetchSuggest={fetchSuggest}
                        selectSuggestWordHandle={selectSuggestWordHandle}
                    />
                    <ul className={css['search-quick-enter']}>
                        <li>
                            <Link to="/graph?q=吴恩达%20斯坦福大学&id=384393d2028745cb8d8f7cd6e564d81a&type=0&qt=EXPERT">
                                吴恩达
                            </Link>
                        </li>
                        <li>
                            <Link to="/graph?q=Yoshua%20Bengio%20Universitede%20Montreal&id=8d571e49c10849c988434a450a303874&type=0&qt=EXPERT">
                                Yoshua Bengio
                            </Link>
                        </li>
                        <li>
                            <Link to="/graph?q=周志华%20南京大学&id=0ea4a73dbcec4847a07ee2a1d437254b&type=0&qt=EXPERT">
                                周志华
                            </Link>
                        </li>
                        <li>
                            <Link to="/graph?q=机器学习&id=F0602&type=0&qt=SUBJECT">机器学习</Link>
                        </li>
                        <li>
                            <Link to="/graph?q=文本分类&id=CT100011739&type=0&qt=SUBJECT">
                                文本分类
                            </Link>
                        </li>
                        <li>
                            <Link to="/graph?q=自然语言处理&id=F0604&type=0&qt=SUBJECT">
                                自然语言处理
                            </Link>
                        </li>
                    </ul>
                </div>

                <ul className={css['count-list']}>
                    <li>
                        <span>
                            {' '}
                            <b>340万+</b>
                            <span>计算机论文</span>
                        </span>
                        <i>
                            <img src={paperIco}></img>
                        </i>
                    </li>
                    <li>
                        <span>
                            <b>150万+</b>
                            <span>计算机专利</span>
                        </span>
                        <i>
                            <img src={patentIco}></img>
                        </i>
                    </li>
                    <li>
                        <span>
                            <b>200万+</b>
                            <span>科研机构</span>
                        </span>
                        <i>
                            <img src={orgIco}></img>
                        </i>
                    </li>
                    <li>
                        <span>
                            <b>150万+</b>
                            <span>科研成果</span>
                        </span>
                        <i>
                            <img src={resultIco}></img>
                        </i>
                    </li>
                    <li>
                        <span>
                            <b>100万+</b>
                            <span>专家</span>
                        </span>
                        <i>
                            <img src={expertIco}></img>
                        </i>
                    </li>
                </ul>
            </div>
        </div>
    );
};
export default Home;
