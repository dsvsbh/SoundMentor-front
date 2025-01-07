<template>
  <el-header class="header">
    <div class="logo">
      <img class="logo-img" src="../assets/logo.png" alt="logo" />
      <span class="logo-text">SoundMentor</span>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="menu"
      mode="horizontal"
      router
    >
      <el-menu-item index="/docs">声源技术文档</el-menu-item>
      <el-menu-item index="/ppt">有声PPT材料</el-menu-item>
      <el-menu-item index="/assistant">预设文档助手</el-menu-item>
      <el-menu-item index="/language">语言学习助手</el-menu-item>
      <el-menu-item index="" @click="showLoginModal">
        <el-icon color="#79b2ff"><User /></el-icon>
        登录
      </el-menu-item>
      <el-menu-item index="" @click="showRegisterModal">
        <el-icon color="#79b2ff"><Plus /></el-icon>
        注册
      </el-menu-item>
    </el-menu>
    <login-dialog ref="loginDialog" />
  </el-header>
</template>

<script>
import { ref } from "vue";
import { User, Plus } from "@element-plus/icons-vue";
import loginDialog from "./LoginDialog.vue";

export default {
  name: "HeaderNav",
  components: {
    loginDialog,
    User,
    Plus,
  },
  setup() {
    const activeIndex = ref(location.pathname);

    return {
      activeIndex,
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
}

.menu :deep(.el-menu-item):hover {
  color: #4cd4dc !important;
}

.menu :deep(.el-menu-item)::after {
  background-color: #4cd4dc !important;
}
</style> 