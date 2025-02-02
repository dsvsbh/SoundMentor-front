import './assets/main.scss'
import { createApp } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'; // 引入中文语言包
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App);

app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
});
app.use(createPinia())
app.mount('#app')

