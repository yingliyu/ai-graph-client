import React from 'react';
import { Select, Spin } from 'antd';
import classnames from 'classnames';
import css from './index.module.less';
const searchIco = require('./imgs/search_ico.png');
const { Option } = Select;

interface ISearch {
    width?: number;
    height: number;
    placeholder?: string;
    value?: string;
    refSelect: any;
    focusHandle?: any;
    blurHandle?: any;
    mouseEnterHandle?: any;
    mouseLeaveHandle?: any;
    suggestInfo: any;
    fetchSuggest: any;
    selectSuggestWordHandle: any;
    onDropdownVisibleChange?: any;
    history?: any;
}
// const useQuery = () => {
//     return new URLSearchParams(useLocation().search);
// };
export default function Search(props: ISearch) {
    // let location = useLocation();
    // const queryStr = useQuery();
    // const selectValue = queryStr.get('q');

    const {
        width,
        height,
        value,
        placeholder,
        refSelect,
        focusHandle,
        blurHandle,
        mouseEnterHandle,
        mouseLeaveHandle,
        suggestInfo,
        fetchSuggest,
        selectSuggestWordHandle
    } = props;
    const notFoundContent = () => {
        // return suggestInfo.loading ? <Spin size="small" /> : '无关联知识图谱，请重新输入';
        if (suggestInfo.loading) {
            return <Spin size="small" />;
        } else {
            if (value) {
                return '无关联知识图谱，请重新输入';
            } else {
                return null;
            }
        }
        // if (suggestInfo.loading || value) {
        //     if (suggestInfo.loading) {
        //         return <Spin size="small" />;
        //     } else {
        //         return '无关联知识图谱，请重新输入';
        //     }
        // } else {
        //     return null;
        // }
    };

    return (
        <div
            style={{ width: width || '60%', height: height }}
            // className={css[props.history ? 'search-round-wrapper' : 'search-wrapper']}
            className={classnames(
                css[props.history ? 'search-round-wrapper' : ''],
                css['search-wrapper']
            )}
        >
            <Select
                ref={refSelect}
                showSearch
                value={value}
                placeholder={placeholder}
                notFoundContent={notFoundContent()}
                filterOption={false}
                onFocus={focusHandle}
                onBlur={blurHandle}
                onMouseEnter={mouseEnterHandle}
                onMouseLeave={mouseLeaveHandle}
                onSearch={(value) => fetchSuggest(value)}
                onChange={(value: any) => selectSuggestWordHandle(value)}
                style={{ width: width || '100%', height: height }}
                showArrow={false}
                defaultActiveFirstOption={true}
                getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                dropdownStyle={{ textAlign: 'left', background: '#28283C', color: '#fff' }}
            >
                {suggestInfo.list.length &&
                    suggestInfo.list.map((item: any) => (
                        <Option
                            key={item.entityId}
                            value={JSON.stringify({
                                entityName: item.entityName,
                                entityId: item.entityId,
                                entityType: item.entityType ? item.entityType : ''
                            })}
                        >
                            {item.entityName + (item.orgName ? ' ' + item.orgName : '')}
                        </Option>
                    ))}
            </Select>
            <img src={searchIco} className={css['search-icon']} />
        </div>
    );
}
