import { AppPost, AppGet } from '../../utils/request';
// 专家关系图谱
interface expertGraphParams {
    entityId: string;
    entityName: string;
}
export function getExpertGraph(params: expertGraphParams) {
    return AppPost('/aikg/data-service/expert/relation-graph/v1', params);
}

// 专家资源图谱
export function getExpertResourceGraph(params: expertGraphParams) {
    return AppPost('/aikg/data-service/expert/resource-graph/v1', params);
}
interface IVisualizationParam {
    expertId: string;
}
// 专家可视化
export function getVisualData(params: IVisualizationParam) {
    return AppGet('/aikg/data-service/expert/visual/v1', params);
}

interface IExpertRelationDetail {
    sourceId: 'string';
    targetId: 'string';
    targetName: 'string';
    targetType: 'string';
}
// 专家关系浮层
export function getExpertRelationDetail(params: IExpertRelationDetail) {
    return AppPost('/aikg/data-service/expert/relation-detail/v1', params);
}
