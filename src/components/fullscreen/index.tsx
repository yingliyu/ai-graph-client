import React from 'react';
import screenfull from 'screenfull';
import { message, Tooltip, Icon } from 'antd';
import css from './index.module.less';
const Fullscreen = () => {
    const manageFullscreen = () => {
        if (screenfull.isEnabled) {
            screenfull.request();
        } else {
            message.warn('当前浏览器不支持全屏～');
        }
    };

    // 退出全屏
    const exitFullscreen = () => {
        if (screenfull.isEnabled) {
            screenfull.exit();
        }
    };

    // 获取当前屏幕是否是全屏状态true/false
    const isFullscreen = () => {
        if (screenfull.isEnabled) {
            const isFullscreen = screenfull.isFullscreen;
            return isFullscreen;
        }
        return false;
    };
    return (
        <div className={css['fullscreen-wrapper']}>
            {!isFullscreen() && (
                <Tooltip title="进入全屏模式">
                    <Icon onClick={manageFullscreen} type="fullscreen" />
                </Tooltip>
            )}
            {isFullscreen() && (
                <Tooltip title="退出全屏">
                    <Icon onClick={exitFullscreen} type="fullscreen-exit" />{' '}
                </Tooltip>
            )}
        </div>
    );
};
export default Fullscreen;
