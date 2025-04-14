import request from '@/utils/request.js'
import { ElMessage } from 'element-plus';

export const getRandomWords = async (form) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const queryParams = new URLSearchParams();
        if (form.language) {
            queryParams.append('language', form.language);
        }
        //1123
        if (form.type) {
            queryParams.append('type', form.type);
        }
        const res = await request.get('/language-content/random', {
            headers: {
                Authorization: token
            },
            params: queryParams
        });

        if (res.code === '0') {
            return res.data
        } else {
            ElMessage.error(res.message)
        }

    } catch (err) {
        console.error("根据条件获取随机内容出错！", err.message);
        throw err;
    }
};

export const uploadLangContent = async (form) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }

        const res = await request.post('/language-content/add', form, {
            headers: {
                Authorization: token
            }
        });

        if (res.code === '0') {
            return res.data
        } else {
            ElMessage.error(res.message)
        }

    } catch (err) {
        console.error("根据条件获取随机内容出错！", err.message);
        throw err;
    }
}
