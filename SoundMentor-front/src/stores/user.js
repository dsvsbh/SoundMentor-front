import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        isLoggedIn: false,
        username: ''
    }),
    actions: {
        setLoginStatus(status) {
            this.isLoggedIn = status
        },
        setUsername(name) {
            this.username = name
        },
        logout() {
            this.isLoggedIn = false
            this.username = ''
            // 其他登出逻辑
        }
    }
}) 