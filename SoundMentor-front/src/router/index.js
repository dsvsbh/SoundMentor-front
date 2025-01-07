//导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
//导入组件
import Home from '../views/Home.vue'

//定义路由关系
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router