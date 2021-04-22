import instance from './axios';
import { message } from 'antd';
import qs from 'qs';
message.config({
    top: 40,
    duration: 1,
    maxCount: 1
});
export function AppPost(url, data) {
    return new Promise((resolve, reject) => {
        instance
            .post(url, data)
            .then((res) => {
                if (res.data.code === 200) {
                    resolve(res.data.data);
                } else {
                    message.error(res.data.msg);
                    reject(res.data.msg);
                }
            })
            .catch((err) => {
                message.error(err.toString());
                reject(err);
            });
    });
}

export function AppGet(url, data) {
    return new Promise((resolve, reject) => {
        instance
            .get(url, {
                params: {
                    ...data
                },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { indices: false });
                }
            })
            .then((res) => {
                if (res.data.code === 200) {
                    resolve(res.data.data);
                } else {
                    message.error(res.data.msg);
                    reject(res.data.msg);
                }
            })
            .catch((err) => {
                message.error(err.toString());
                reject(err);
            });
    });
}
