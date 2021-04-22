import { AppGet } from '../../utils/request';

// 获取示例接口
interface exampleType {
    page: number;
}
export function getExamples(params: exampleType) {
    return AppGet('/aikg/data-service/search/getExamples', params);
}

// 获取联想词接口
interface suggestType {
    word: string;
}
export function getSuggestWords(params: suggestType) {
    return AppGet('/aikg/data-service/search/suggest', params);
}

interface INodeDetail {
    id: string;
    type: string;
}
//获取专家/学科词实体浮层
export function getNodeDetail(params: INodeDetail) {
    return AppGet('/aikg/data-service/entityDetail/getDetail', params);
}
interface IExpertParam {
    expertId: string;
    pageSize: number;
    pageNum: number;
}
// 相关/同领域专家
export function getRelationExperts(params: IExpertParam) {
    return AppGet('/aikg/data-service/expert/visualdoDomain/v1', params);
}
