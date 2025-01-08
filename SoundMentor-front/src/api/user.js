// 导入请求工具
import request from '@/utils/request.js'
import axios from 'axios'

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
    const loginRes = await request.post('/openApi/user/login', JSON.stringify(loginData), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // 保存 token  
    localStorage.setItem('token', loginRes.data.token);

    // 保存用户信息到本地存储  
    localStorage.setItem('userInfo', JSON.stringify(loginRes.data));

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



//                        需要请求头

export const logoutService = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/user/logout', {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};
