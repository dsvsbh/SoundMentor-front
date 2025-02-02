// 导入请求工具
import request from '@/utils/request.js'
import axios from 'axios'
import { ElMessage } from 'element-plus';

//                        免登接口

// 注册
export const userRegisterService = (registerData) => {
    const registerRes = request.post('/openApi/user/addUser', JSON.stringify(registerData), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return registerRes;
}

// 登录
export const userLoginService = async (loginData) => {
    const loginRes = await request.post('/openApi/user/login', loginData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // 保存 token  
    localStorage.setItem('token', loginRes.data.token);

    // 保存用户信息到本地存储  
    const userInfo = await getUserInfoService();
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    console.log(userInfo);

    return loginRes;
}

// 忘记密码
export const userForgotPasswordService = (forgotPasswordData) => {
    var params = new URLSearchParams()
    for (let key in forgotPasswordData) {
        params.append(key, forgotPasswordData[key])
    }
    return request.post('/openApi/user/forgetPassword', params)
}


// 发送邮箱验证码
export const sendEmailService = (email) => {
    return request.post('/openApi/user/sendEmail?email=' + email);
}



// =========================需要请求头===========================
// 获取用户信息
export const getUserInfoService = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await request.get('/user/getWebUser', {
            headers: { Authorization: token },
        });
        if (response.code == 0) {
            console.log("获取用户信息成功", response.data);
            return response.data;
        } else {
            console.log("获取用户信息失败", response.message);
        }
    } catch (error) {
        console.log("获取用户信息失败", error);
    }
}

// 用户登出
export const logoutService = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/user/logout', {}, {
        headers: {
            Authorization: token,
        },
    });

    return response.data;
};
// 修改用户信息
export const updateUserInfoService = async (userInfo) => {
    try {
        const token = localStorage.getItem('token');
        console.log(userInfo);
        const response = await request.post('/user/updateUserInfo', userInfo, {
            headers: { Authorization: token },
            'Content-Type': 'application/json'
        });
        if (response.code === "0") {
            await getUserInfoService();
            return response.data;
        } else {
            console.log("获取失败：", response.message);
        }
    } catch (err) {
        Promise.reject(err);
    }
};
// 修改用户密码
export const updateUserPasswordService = (passwordInfo) => {
    try {
        const token = localStorage.getItem('token');
        const response = request.post('/user/updatePassword', JSON.stringify(passwordInfo), {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },

        });
        return response;
    } catch (err) {
        console.log(err.message);
    }
}

// 用户文件列表（条件动态分页）
// {
//     "fileTypes": [
//         "MP3"
//     ],
//     "fileName": "string",
//     "pageNum": 0,
//     "pageSize": 0
// }
export const getUserFiles = (pageDTO) => {
    try {
        const token = localStorage.getItem('token');
        const res = request.post('/user/files', pageDTO, {
            headers: {
                Authorization: token,
            }
        })
        if (res.code == "0") {
            console.log("获取文件成功");

            return res;
        } else {
            console.log("获取失败！");
            console.log(pageDTO)
            return res;
        }

    } catch (err) {
        ElMessage.error(err.message);
    }
}

