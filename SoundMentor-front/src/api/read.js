import request from '@/utils/request'
import { ElMessage } from 'element-plus'

/**
 * 生成预设文本朗读音频
 */
export const generateNormalTts = async (data) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.post('/tts/generate', data, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        })

        if (res.code === '0') {
            return res.data
        } else {
            ElMessage.error(res.message)
            throw new Error(res.message)
        }
    } catch (err) {
        console.error("生成音频失败", err.message);
        throw err;
    }
}

/**
 * 分页查询预设文本朗读历史记录
 */
export const getNormalTtsRecords = async (params) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.get('/tts/records', {
            headers: {
                Authorization: token
            },
            params: {
                pageNum: params.pageNum || 1,
                pageSize: params.pageSize || 10
            }
        })

        if (res.code === '0') {
            return res.data
        } else {
            ElMessage.error(res.message)
        }
    } catch (err) {
        console.error("获取记录失败", err.message);
        throw err;
    }
}

/**
 * 批量删除预设文本朗读记录
 */
export const batchDeleteNormalTtsRecords = async (ids) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.post('/tts/batchDelete', ids, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        })

        if (res.code === '0') {
            return res.data
        } else {
            ElMessage.error(res.message)
            throw new Error(res.message)
        }
    } catch (err) {
        console.error("批量删除失败", err.message);
        throw err;
    }
}

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