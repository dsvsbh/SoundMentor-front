<template>
  <div class="container">
    <el-header class="header">
      <div class="logo">
        <img class="logo-img" src="../assets/logo.png" alt="logo" />
        <span class="logo-text">SoundMentor</span>
      </div>
      <el-menu :default-active="activeIndex" class="menu" mode="horizontal">
        <el-menu-item index="1">声源技术文档</el-menu-item>
        <el-menu-item index="2">有声PP材料</el-menu-item>
        <el-menu-item index="3">预设文档助手</el-menu-item>
        <el-menu-item index="4">语言学习助手</el-menu-item>
      </el-menu>
      <div class="user-actions">
        <el-button @click="showLoginModal">登录</el-button>
        <el-button type="primary" @click="showRegisterModal">注册</el-button>
      </div>
    </el-header>
    <login-dialog ref="loginDialog" />
    <el-main>
      <div class="hero">
        <h1>智能语音合成</h1>
        <p>打造专业的语音转换方案，让学习更生动</p>
        <el-carousel>
          <el-carousel-item v-for="item in carouselItems" :key="item.id">
            <h2>{{ item.title }}</h2>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="features">
        <el-row :gutter="20">
          <el-col v-for="feature in features" :key="feature.title" :span="6">
            <el-card>
              <div class="feature-icon">
                <i :class="feature.icon"></i>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="statistics">
        <el-row :gutter="20">
          <el-col v-for="(stat, index) in statistics" :key="index" :span="6">
            <div class="statistiс">
              <h2>{{ stat.value }}</h2>
              <p>{{ stat.label }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-main>

    <el-footer class="footer">
      <div class="footer-info">
        <h3>关于我们</h3>
        <p>致力于提供优质的声音处理解决方案，推动音频技术的发展。</p>
      </div>
      <div class="contact-info">
        <h3>联系我们</h3>
        <p>邮箱: support@example.com</p>
        <p>电话: 400-123-4567</p>
      </div>
    </el-footer>
  </div>
</template>  

<script>
import { ref } from "vue";
import loginDialog from "../components/LoginDialog.vue";
export default {
  components: {
    loginDialog,
  },
  data() {
    return {
      activeIndex: "1",
      carouselItems: [
        { id: 1, title: "AI语音助手" },
        { id: 2, title: "音频处理技术" },
      ],
      features: [
        {
          title: "声音技术文档",
          description: "详细的声音技术资料，以助于理解。",
          icon: "el-icon-mic",
        },
        {
          title: "有声PP资料",
          description: "专业的有声资料库，供学习使用。",
          icon: "el-icon-document",
        },
        {
          title: "预设文档助手",
          description: "高效的文档助手，快速生成所需资料。",
          icon: "el-icon-time",
        },
        {
          title: "语言学习助手",
          description: "多种语言学习助手，提升学习效果。",
          icon: "el-icon-chat-dot-square",
        },
      ],
      statistics: [
        { value: "10,000+", label: "注册用户" },
        { value: "50,000+", label: "文档阅读" },
        { value: "98%", label: "用户满意度" },
        { value: "24/7", label: "客服支持" },
      ],
    };
  },
  methods: {
    showLoginModal() {
      this.$refs.loginDialog.visible = true;
      this.$refs.loginDialog.isLogin = true; // 显示登录表单
    },
    showRegisterModal() {
      this.$refs.loginDialog.visible = true;
      this.$refs.loginDialog.isLogin = false; // 显示注册表单
    },
  },
};
</script>  

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #f5f5f5;
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

.user-actions {
  display: flex;
  gap: 10px;
}

.hero {
  text-align: center;
  padding: 50px 0;
  background-color: #e0e0e0;
}

.features {
  padding: 20px;
}

.feature-icon {
  font-size: 40px;
  text-align: center;
}

.statistics {
  padding: 30px 0;
  background-color: #f9f9f9;
}

.statistiс {
  text-align: center;
}

.footer {
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
}

.footer-info,
.contact-info {
  margin: 10px 0;
}
</style>