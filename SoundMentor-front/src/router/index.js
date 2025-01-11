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
        component: Home,
        meta: {
            title: '首页'
        }
    },
    {
        path: '/docs',
        name: 'docs',
        component: DocsView,
        meta: {
            title: '声音样本库'
        }
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: {
            title: '个人中心'
        }
    },
    {
        path: '/group',
        name: 'group',
        component: GroupView,
        meta: {
            title: '我的组织'
        }
    },
    {
        path: '/groupDetails/:id',
        name: 'groupDetails',
        component: GroupDetails,
        meta: {
            title: '组员详情'
        }
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
router.beforeEach((to, from, next) => {
    document.title = "SoundMentor" + " | " + to.meta.title;
    next();
});
export default router;
