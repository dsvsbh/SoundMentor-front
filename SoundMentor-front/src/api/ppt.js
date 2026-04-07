import request from '@/utils/request.js'

// 创建有声PPT任务
export const createPPTTask = async (url, taskName) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        // 直接在URL中传递参数，避免axios自动编码
        let params = `url=${url}`;
        if (taskName) {
            params += `&taskName=${encodeURIComponent(taskName)}`;
        }
        const res = await request.post(`/ppt/createTask?${params}`, null, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });

        return res;

    } catch (err) {
        console.log("创建PPT任务错误！", err.message);
        throw err;
    }
};

// 生成讲解
export const generateExplanation = async (taskId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.post('/ppt/generateExplanation', null, {
            params: { taskId },
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });

        return res;

    } catch (err) {
        console.log("生成讲解错误！", err.message);
        throw err;
    }
};

// 生成讲解语音
export const generateExplanationVoice = async (taskId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.post('/ppt/generateExplanationVoice', null, {
            params: { taskId },
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });

        return res;

    } catch (err) {
        console.log("生成讲解语音错误！", err.message);
        throw err;
    }
};

// 生成有声PPT
export const generateSoundPPT = async (taskId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.post('/ppt/generateSoundPPT', null, {
            params: { taskId },
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });

        return res;

    } catch (err) {
        console.log("生成有声PPT错误！", err.message);
        throw err;
    }
};

// 任务查询
export const queryTask = async (taskId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.post('/ppt/queryTask', null, {
            params: { taskId },
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });

        return res;

    } catch (err) {
        console.log("查询任务错误！", err.message);
        throw err;
    }
};

// 列出当前用户的所有PPT任务
export const listTasks = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.post('/ppt/listTasks', null, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });

        return res;

    } catch (err) {
        console.log("列出任务错误！", err.message);
        throw err;
    }
};

// 单个编辑讲解
export const editExplanation = async (data) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.post('/ppt/editExplanation', data, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });

        return res;

    } catch (err) {
        console.log("编辑讲解错误！", err.message);
        throw err;
    }
};

// 单个编辑讲解语音
export const editExplanationVoice = async (data) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.post('/ppt/editExplanationVoice', data, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });

        return res;

    } catch (err) {
        console.log("编辑讲解语音错误！", err.message);
        throw err;
    }
};

// 批量删除PPT任务
export const batchDeleteTasks = async (taskIds) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.post('/ppt/batchDeleteTasks', taskIds, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });

        return res;

    } catch (err) {
        console.log("批量删除任务错误！", err.message);
        throw err;
    }
};

// 获取声音列表
export const listVoices = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.get('/tts/listVoices', {
            headers: {
                Authorization: token
            }
        });

        return res;

    } catch (err) {
        console.log("获取声音列表错误！", err.message);
        throw err;
    }
};