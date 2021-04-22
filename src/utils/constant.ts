// 实体的类型
export const ALL_NODE_TYPES: any = {
    EXPERT: '专家',
    SUBJECT: '学科词',
    ORG: '机构',
    JOURNAL: '期刊',
    PAPER: '论文',
    PATENT: '专利',
    PROJECT: '项目'
};

// 柱状图颜色
export const BAR_COLORS = ['#2f83e4', '#00e5c1', '#23cbff', '#fdc765', '#f27d51'];

export const BAR_COLORS_LIGHT = ['#13d8ba', '#23cbff', '#fdc765', '#f27d51', '#602CFF', '#2f83e4'];
export const BAR_COLORS_DRAK = ['#00c3b5', '#11A6D0', '#DEA821', '#DB3E13', '#4915E6'];

// 图谱实体颜色
export const COLOR_OBJ: any = {
    THEME: '#A89DFF',
    SUBJECT: '#ff7043',
    ORG: '#23cbff',
    JOURNAL: '#ff7e90',
    EXPERT: '#2f83e4',
    PAPER: '#00e5c1',
    PATENT: '#f6bb42',
    PROJECT: '#967adc'
};

// 词云颜色
export const WORD_CLOUD_COLORS = ['#2f83e4', '#2f83e4', '#2f83e4'];

// 关系图谱的关系类型
export const RELATION_TYPES: any = {
    samePapers: '共同发文',
    samePatents: '共同专利',
    sameDomains: '同领域',
    pubJournal: '发表',
    tenure: '任职',
    graduate: '毕业于',
    academicExchange: '学术交流',
    coPapers: '论文合作',
    coPatents: '专利合作',
    coProjects: '项目合作'
};

// colorList: ['#967adc', '#8cc152', '#3bafda',
// '#f6bb42', '#37bc9b', '#ff7e90', '#ff7043'],
// 专家资源图谱所有实体类型
export const expertResourceNodeTypes = {
    // expert: '专家',
    // subject: '学科词',
    paper: '论文',
    patent: '专利',
    project: '项目'
};
// 学科词关系图谱所有类型
export const subjectRelationNodeTypes = {
    expert: '专家',
    org: '机构',
    journal: '期刊'
};
// 学科词资源图谱所有类型
export const subjectResourceNodeTypes = {
    // subject: '学科词',
    paper: '论文',
    patent: '专利',
    project: '项目'
};
