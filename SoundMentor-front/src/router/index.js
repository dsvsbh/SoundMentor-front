//导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
//导入组件
import Home from '../views/Home.vue'
import DocsView from '../views/DocsView.vue'
import ProfileView from '../views/ProfileView.vue'
import GroupView from '../views/GroupView.vue'
import GroupDetail from '../components/group/GroupDetail.vue'
import PPTView from '../views/PPTView.vue'
import GroupMembers from '../components/group/GroupMembers.vue'
import StudyView from '@/views/StudyView.vue'
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
        path: '/groupDetail/:id',
        name: 'groupDetail',
        component: GroupDetail,
        meta: {
            title: '组织详情'
        }
    },
    {
        path: '/groupMembers/:id',
        name: 'groupMembers',
        component: GroupMembers,
        meta: {
            title: '成员详情'
        }
    },

    {
        path: '/ppt',
        name: 'ppt',
        component: PPTView,
        meta: {
            title: 'PPT制作'
        }
    },
    {
        path: '/study',
        name: 'study',
        component: StudyView,
        meta: {
            title: '语音辅助学习'
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
