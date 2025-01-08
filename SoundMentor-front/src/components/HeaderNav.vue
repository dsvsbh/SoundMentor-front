<template>
  <el-header class="header">
    <router-link to="/" class="logo">
      <img class="logo-img" src="../assets/logo.png" alt="logo" />
      <span class="logo-text">SoundMentor</span>
    </router-link>
    <el-menu
      :default-active="activeIndex"
      class="menu"
      mode="horizontal"
      router
      @select="handleSelect"
    >
      <el-menu-item index="/docs">声音样本库</el-menu-item>
      <el-menu-item index="/ppt">有声PPT制作</el-menu-item>
      <el-menu-item index="/assistant">预设文本朗读</el-menu-item>
      <el-menu-item index="/language">语言学习辅助</el-menu-item>

      <div class="menu-right">
        <template v-if="!isLoggedIn">
          <el-menu-item index="" @click="showLoginModal">
            <el-icon><User /></el-icon>
            登录
          </el-menu-item>
          <el-menu-item index="" @click="showRegisterModal">
            <el-icon><Plus /></el-icon>
            注册
          </el-menu-item>
        </template>
        <el-menu-item index="" v-else>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="user-dropdown">
              <el-icon><User /></el-icon>
              {{ username }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-menu-item>
      </div>
    </el-menu>
    <login-dialog ref="loginDialog" />
  </el-header>
</template>

<script>
import { ref, computed } from "vue";
import { User, Plus } from "@element-plus/icons-vue";
import loginDialog from "./LoginDialog.vue";
import { useUserStore } from "../stores/user";

export default {
  name: "HeaderNav",
  components: {
    loginDialog,
    User,
    Plus,
  },
  setup() {
    const store = useUserStore();
    const activeIndex = ref(location.pathname);

    const isLoggedIn = computed(() => store.isLoggedIn);
    const username = computed(() => store.username);

    const handleSelect = (index) => {
      if (index === "") {
        activeIndex.value = location.pathname;
      } else {
        activeIndex.value = index;
      }
    };

    const handleCommand = (command) => {
      switch (command) {
        case "profile":
          router.push("/profile");
          break;
        case "logout":
          store.logout();
          break;
      }
    };

    return {
      activeIndex,
      handleSelect,
      isLoggedIn,
      username,
      handleCommand,
    };
  },
  methods: {
    showLoginModal() {
      this.$refs.loginDialog.visible = true;
      this.$refs.loginDialog.isLogin = true;
    },
    showRegisterModal() {
      this.$refs.loginDialog.visible = true;
      this.$refs.loginDialog.isLogin = false;
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  padding: 0 20px;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: white;
  padding: 10px;
  text-decoration: none;
  cursor: pointer;
}

.logo-img {
  width: 40px;
  height: 40px;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #4cd4dc;
}

.menu {
  flex-grow: 1;
  justify-content: space-between;
}
.menu-right {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.menu :deep(.el-menu-item):hover {
  color: #4cd4dc !important;
}

.menu :deep(.el-menu-item)::after {
  background-color: #4cd4dc !important;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}
</style> 