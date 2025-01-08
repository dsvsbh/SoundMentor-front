//导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
//导入组件
import Home from '../views/Home.vue'
import DocsView from '../views/DocsView.vue'
import ProfileView from '../views/ProfileView.vue'
//定义路由关系
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/docs',
        name: 'docs',
        component: DocsView
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router