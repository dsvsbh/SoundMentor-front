//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
//定义一个变量,记录公共的前缀, baseURL
const baseURL = '/api';         //http://localhost:8080
const instance = axios.create({ baseURL })


//添加响应拦截器
instance.interceptors.response.use(
    result => {
        // return result.data;
        // 如果业务状态码为0，代表操作成功
        if (result.data.code == 0) {
            return result.data;
        }
        ElMessage.error(result.data.message || '服务异常');
        return Promise.reject(result.data);
    },
    err => {
        ElMessage.error('服务异常');
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)
//添加请求拦截器
instance.interceptors.request.use(config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    // 如果有 token 则添加到请求头
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default instance;