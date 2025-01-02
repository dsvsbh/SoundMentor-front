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
export const userLoginService = (loginData) => {
    var params = new URLSearchParams()
    for (let key in loginData) {
        params.append(key, loginData[key])
    }
    return request.post('/user/login', params)
}
