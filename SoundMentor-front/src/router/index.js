//导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
//导入组件
import Home from '../views/Home.vue'
import DocsView from '../views/DocsView.vue'
import ProfileView from '../views/ProfileView.vue'
import GroupView from '../views/GroupView.vue'
import GroupDetails from '../components/GroupDetails.vue'
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
    },
    {
        path: '/group',
        name: 'group',
        component: GroupView
    },
    {
        path: '/groupDetails/:id',
        name: 'groupDetails',
        component: GroupDetails
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes
});

//    路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.path === '/group' && !token) {
        next('/');
    } else {
        next();
    }
});

export default router