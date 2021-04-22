import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export type INode = SimulationNodeDatum & {
    id: string;
    name: string;
    type: string;
    level: number;
};

export type ILink = SimulationLinkDatum<INode> & {
    label?: string;
    relType: string;
};

export interface INodeColor {
    [propName: string]: string;
}

export interface IGraphData {
    entities: INode[];
    relations: ILink[];
    expertId?: string;
    expertName?: string;
    subjectId?: string;
    subjectName?: string;
    entityTotal: number;
    relationTotal: number;
}

export interface IGraphComponentProps {
    data: IGraphData;
    filterType: string;
    allNodeTypes?: any;
    graphType?: number;
    nodeColors?: any;
    svgWidth?: number;
    svgHeight?: number;
    clickResourceNodeHandle?: any;
    clickNodeHandle?: any;
    clickRelativeLabel?: any;
    filterGraph?: any;
    graphLegendType?: number;
}
