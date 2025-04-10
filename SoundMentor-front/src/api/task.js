import request from '@/utils/request.js'

//任务执行公共接口
export const taskExecutionService = async (data) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.post('/task/createTask', data, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });

        return res;

    } catch (err) {
        console.log("任务执行错误！", err.message);
    }
};

// 获取任务详情     GET
export const getTaskDetailById = async (taskId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.get(`/task/getTaskById/${taskId}`, {
            headers: { Authorization: token },
        });
        if (res.code === "0") {
            return res;
        }
        else {
            console.log(res.message);
        }
    } catch (err) {
        console.log("获取任务详情出错！", err.message);
    }
}

// 获取ppt任务结果
export const getPptTask = async (userPptId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.get(`/task/getPptTask/${userPptId}`, {
            headers: { Authorization: token },
        });
        if (res.code === "0") {
            return res.data;
        }
        else {
            console.log(res.message);
        }
    } catch (err) {
        console.log("获取任务详情出错！", err.message);
    }
}

// 修改有声ppt结果
export const updatePPT = async (form) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.put('/task/updatePPTResult', form, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        })
        return res;
    }

    catch (err) {
        console.log("修改有声ppt结果出错！", err.message);
    }
}

export const getPptResult = async (pptId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("认证失败！");
        }
        const res = await request.get(`/task/getppt/${pptId}`, {
            headers: { Authorization: token },
        });
        if (res.code === "0") {
            return res.data;
        }
        else {
            console.log(res.message);
        }
    } catch (err) {
        console.log("获取任务详情出错！", err.message);
    }
}