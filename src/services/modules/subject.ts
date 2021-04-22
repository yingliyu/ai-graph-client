import { AppPost, AppGet } from '../../utils/request';
// 学科词关系图谱
interface subjectGraphParams {
    entityId: string;
    entityName: string;
}
export function getSubjectGraph(params: subjectGraphParams) {
    return AppPost('/aikg/data-service/subject/relation-graph/v1', params);
}

// 学科词资源图谱
interface subjectGraphParams {
    entityId: string;
    entityName: string;
}
export function getSubjectResourceGraph(params: subjectGraphParams) {
    return AppPost('/aikg/data-service/subject/resource-graph/v1', params);
}
interface ISubVisualizationParam {
    subjectId: string;
}
// 可视化
export function getSubjectVisualData(params: ISubVisualizationParam) {
    return AppGet('/aikg/data-service/subject/visual/v1', params);
}
