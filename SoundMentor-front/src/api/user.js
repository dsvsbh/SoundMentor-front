// 导入请求工具
import request from '@/utils/request.js'


//注册
export const userRegisterService = (registerData) => {
    var params = new URLSearchParams()
    for (let key in registerData) {
        params.append(key, registerData[key])
    }
    return request.post('/user/register', params)
}

// 登录
export const userLoginService = async (loginData) => {
    var params = new URLSearchParams()
    for (let key in loginData) {
        params.append(key, loginData[key])
    }
    const loginRes = await request.post('/user/login', params)
    // 保存 token
    localStorage.setItem('token', loginRes.data.token)
    const userInfo = await getUserInfoService()
    // 保存用户信息到本地存储
    localStorage.setItem('userInfo', JSON.stringify(userInfo.data))

    return loginRes
}

// 忘记密码
export const userForgotPasswordService = (forgotPasswordData) => {
    var params = new URLSearchParams()
    for (let key in forgotPasswordData) {
        params.append(key, forgotPasswordData[key])
    }
    return request.post('/user/forgetPassword', params)
}

// 获取用户信息
export const getUserInfoService = () => {
    return request.get('/user/info')
}

// 发送邮箱验证码
export const sendEmailService = (email) => {
    return request.post('/user/sendEmail', { email })
}
