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
        <template v-else>
          <el-menu-item index="">
            <el-icon><User /></el-icon>
            <span @click="handleCommand('profile')">
              {{ username ? username : "用户" }}
            </span>
          </el-menu-item>
          <el-menu-item index="">
            <el-icon><Setting /></el-icon>
            <span>设置</span>
          </el-menu-item>
          <el-menu-item index="" @click="handleCommand('logout')">
            <el-icon><Close /></el-icon>
            <span>退出登录</span>
          </el-menu-item>
        </template>
      </div>
    </el-menu>
    <login-dialog ref="loginDialog" />
  </el-header>
</template>  

<script>
import { ref, computed, onMounted } from "vue";
import { User, Plus, Setting, Close } from "@element-plus/icons-vue";
import loginDialog from "./LoginDialog.vue";
import { useUserStore } from "../stores/user";
import { logoutService } from "../api/user";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

export default {
  name: "HeaderNav",
  components: {
    loginDialog,
    User,
    Plus,
    Setting,
    Close,
  },
  setup() {
    const store = useUserStore();
    const activeIndex = ref(location.pathname);
    const router = useRouter();
    const isLoggedIn = computed(() => store.isLoggedIn);
    const username = computed(() => store.username);

    onMounted(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        store.setLoginStatus(true);
        store.setUsername(userInfo.username);
      }
      console.log("isLoggedIn:", store.isLoggedIn, "username:", store.username);
    });

    const handleSelect = (index) => {
      activeIndex.value = index || location.pathname;
    };

    const handleCommand = async (command) => {
      console.log("Command received:", command);
      switch (command) {
        case "profile":
          router.push("/profile");
          break;
        case "logout":
          await handleLogout();
          break;
      }
    };

    const handleLogout = async () => {
      try {
        await logoutService(); // 调用登出接口
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        store.logout(); // 更新状态
        ElMessage.success("成功退出登录");
      } catch (error) {
        console.error("登出失败:", error);
        ElMessage.error("登出失败，请重试");
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
.el-menu .el-menu-item {
  font-size: 18px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.headImg {
  border-radius: 50%;
  width: 15px;
  height: 15px;
}
</style> 