import React from 'react';
import { Select, Button, Spin, Icon } from 'antd';
import { IExampleData } from '../../../../models/search';
import css from './index.module.less';
// import { useLocation } from 'react-router-dom';
const { Option } = Select;

interface ISample {
    ifExample?: boolean;
    showExample: boolean;
    exampleList: IExampleData[];
    activeExampleId: string;
    showExampleHandle: any;
    exampleClickHandle: any;
    examplePageHandle: any;
    setShowExample: any;
}
// const useQuery = () => {
//     return new URLSearchParams(useLocation().search);
// };
export default function Sample(props: ISample) {
    // let location = useLocation();
    // const queryStr = useQuery();
    // const selectValue = queryStr.get('q');

    const {
        ifExample,
        showExample,
        exampleList,
        activeExampleId,
        showExampleHandle,
        exampleClickHandle,
        examplePageHandle,
        setShowExample
    } = props;

    return (
        <div className={css['sample-wrapper']}>
            {ifExample && <span onClick={showExampleHandle}>示例</span>}
            {/* 展示所有示例 */}
            <div
                id="examples-words"
                className={[
                    `${css['examples-wrapper']}`,
                    `${showExample ? css['show-example'] : ''}`
                ].join(' ')}
            >
                <section className={css['expert-words']}>
                    {exampleList.map((item, index) => {
                        return (
                            <Button
                                className={item.entityId === activeExampleId ? css['active'] : ''}
                                key={item.entityName + '_' + index}
                                onClick={(e) => exampleClickHandle(item, e)}
                            >
                                {item.entityName}
                            </Button>
                        );
                    })}
                </section>
                <div className={css['example-footer']}>
                    <Button ghost onClick={examplePageHandle}>
                        换一组
                    </Button>
                    <Button ghost id="close-btn" onClick={() => setShowExample(false)}>
                        关闭
                    </Button>
                </div>
            </div>
        </div>
    );
}
