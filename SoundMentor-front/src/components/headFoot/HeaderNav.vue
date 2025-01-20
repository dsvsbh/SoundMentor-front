<template>
  <el-header class="header">
    <router-link to="/" class="logo">
      <img class="logo-img" src="/src/assets/logo.png" alt="logo" />
      <span class="logo-text">SoundMentor</span>
    </router-link>
    <el-menu
      :default-active="activeIndex"
      class="menu"
      mode="horizontal"
      router
      @select="handleSelect"
    >
      <el-menu-item index="/group" @click="handleMenuClick"
        >我的组织</el-menu-item
      >
      <el-menu-item index="/docs">声音样本库</el-menu-item>
      <el-menu-item index="/ppt">有声PPT制作</el-menu-item>
      <el-menu-item index="/assistant">预设文本朗读</el-menu-item>
      <el-menu-item index="/study">语言学习辅助</el-menu-item>

      <el-sub-menu index="3" class="right" active-text-color="black">
        <template #title
          ><span style="font-size: 16px">{{
            username ? username : "请登录/注册"
          }}</span></template
        >
        <div v-if="!isLoggedIn">
          <el-menu-item index="" @click="showLoginModal">
            <el-icon><User /></el-icon>
            登录
          </el-menu-item>
          <el-menu-item index="" @click="showRegisterModal">
            <el-icon><Plus /></el-icon>
            注册
          </el-menu-item>
        </div>
        <div v-else>
          <el-menu-item index="/profile">
            <el-icon><User /></el-icon>
            <span>{{ username }}</span>
          </el-menu-item>
          <el-menu-item index="3-2" @click="handleCommand('inputShareCode')">
            <el-icon><Edit /></el-icon>
            输入邀请码
          </el-menu-item>
          <el-menu-item index="3-3">
            <el-icon><Setting /></el-icon>
            <span>设置</span>
          </el-menu-item>
          <el-menu-item index="3-4" @click="handleCommand('logout')">
            <el-icon><Close /></el-icon>
            <span>退出登录</span>
          </el-menu-item>
        </div>
      </el-sub-menu>
    </el-menu>
    <input-share-code ref="inputShareCode" />
    <login-dialog ref="loginDialog" />
  </el-header>
</template>  

<script>
import { ref, computed, onMounted } from "vue";
import { User, Plus, Setting, Close, Edit } from "@element-plus/icons-vue";
import loginDialog from "../login/LoginDialog.vue";
import { useUserStore } from "../../stores/user";
import { logoutService } from "../../api/user";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import InputShareCode from "./InputShareCode.vue";

export default {
  name: "HeaderNav",
  components: {
    loginDialog,
    User,
    Plus,
    Setting,
    Close,
    Edit,
    InputShareCode,
  },
  setup() {
    const store = useUserStore();
    const activeIndex = ref(location.pathname);
    const router = useRouter();
    const isLoggedIn = computed(() => store.isLoggedIn);
    const username = computed(() => store.username);
    const inputShareCode = ref(null);
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
        case "logout":
          await handleLogout();
          break;
        case "inputShareCode":
          inputShareCode.value.dialogVisible = true;
          break;
        default:
          console.warn("Unknown command:", command);
      }
    };

    const handleLogout = async () => {
      try {
        await logoutService(); // 调用登出接口
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        store.logout(); // 更新状态
        ElMessage.success("成功退出登录");
        router.push("/");
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
      inputShareCode,
    };
  },
  watch: {
    $route(to) {
      this.activeIndex = to.path;
    },
  },
  methods: {
    handleSelect(index) {
      this.activeIndex = index;
    },
    showLoginModal() {
      this.$refs.loginDialog.visible = true;
      this.$refs.loginDialog.isLogin = true;
    },
    showRegisterModal() {
      this.$refs.loginDialog.visible = true;
      this.$refs.loginDialog.isLogin = false;
    },
    handleMenuClick() {
      if (!this.isLoggedIn) {
        ElMessage.error("请登录");
        this.$refs.loginDialog.visible = true;
      } else {
        this.$router.push("/group");
      }
    },
    showInputShareCode() {
      this.$refs.inputShareCode.dialogVisible = true;
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
.menu :deep(.el-menu-item)::after {
  background-color: white !important;
}
.menu {
  flex-grow: 1;
  justify-content: space-between;
}

.el-menu .el-menu-item {
  font-size: 16px;
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
.right :deep(.el-menu-item) {
  border-bottom: none;
}
.right .el-menu-item:hover {
  border-bottom: none;
}
.right .el-menu-item:active {
  border-bottom: none;
}
</style> 