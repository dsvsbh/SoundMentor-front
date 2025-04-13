import request from '@/utils/request'
import { ElMessage } from 'element-plus'

export const getNormalTtsRecord = async (form) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const queryParams = new URLSearchParams();
        if (form.pageNum) {
            queryParams.append('pageNum', form.pageNum)
        }
        if (form.pageSize) {
            queryParams.append('pageSize', form.pageSize);
        }
        const res = await request.get('/normal-tts-record', {
            headers: {
                Authorization: token
            },
            params: queryParams
        })

        if (res.code === '0') {
            return res.data
        } else {
            ElMessage.error(res.message)
        }
    } catch (err) {
        console.error("出错了", err.message);
        throw err;
    }
}

export const delTtsRecord = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.delete(`/normal-tts-record/${id}`, {
            headers: {
                Authorization: token
            }
        })
        if (res.code === '0') {
            return res.data;
        } else {
            ElMessage.error("出错了", res.message);
        }
    } catch (err) {
        console.error("出错了", err.message);
        throw err;
    }
}