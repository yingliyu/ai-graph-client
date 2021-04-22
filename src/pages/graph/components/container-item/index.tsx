import React, { ReactNode } from 'react';
import Title from '../title';
interface ContainerItemProps {
    width?: number;
    height?: number;
    borderRadius: number;
    backgroundColor: string;
    marginTop?: number;
    paddingBottom?: number;
    marginLeft?: number;
    title?: string;
    borderColor?: string;
    children?: ReactNode | string;
}
// 容器组件
const ContainerItem = (props: ContainerItemProps) => {
    const {
        title,
        borderColor,
        width = 'auto',
        height = 'auto',
        paddingBottom,
        marginTop,
        marginLeft,
        borderRadius,
        backgroundColor,
        children
    } = props;

    return (
        <div
            style={{
                width: width,
                height: height,
                background: backgroundColor,
                borderRadius: borderRadius,
                marginTop: `${marginTop ? marginTop : 0}px`,
                marginLeft: `${marginLeft ? marginLeft : 0}px`,
                borderColor: borderColor ? `${borderColor}px` : 'transparent',
                paddingBottom: paddingBottom || 0,
                textAlign: 'left',
                position: 'relative',
                border: '0px solid #0078FF'
            }}
        >
            {title ? <Title title={title ? title : ''} /> : ''}
            {children}
        </div>
    );
};

export default ContainerItem;
