<template>
  <div class="container">
    <login-dialog ref="loginDialog" />
    <el-main style="">
      <div class="hero">
        <el-carousel>
          <el-carousel-item v-for="item in carouselItems" :key="item.id">
            <div class="carousel-item-content">
              <h1>{{ item.title }}</h1>
              <h3>{{ item.description }}</h3>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="features">
        <el-row :gutter="24">
          <el-col v-for="feature in features" :key="feature.title" :span="12">
            <el-card
              class="feature-card"
              :class="{ hover: feature.isHovered }"
              @mouseenter="feature.isHovered = true"
              @mouseleave="feature.isHovered = false"
            >
              <div class="feature-content">
                <div class="feature-icon">
                  <el-icon size="75">
                    <component :is="feature.icon" />
                  </el-icon>
                </div>
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-desc">{{ feature.description }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="statistics">
        <el-row :gutter="20">
          <el-col v-for="(stat, index) in statistics" :key="index" :span="6">
            <div class="statistiс">
              <h1>{{ stat.value }}</h1>
              <p>{{ stat.label }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-main>

    <el-footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <el-row :gutter="10" style="width: 1100px">
            <!-- 关于我们 -->
            <el-col :span="6">
              <div class="footer-section">
                <h3>{{ footerData.about.title }}</h3>
                <p v-for="(item, index) in footerData.about.items" :key="index">
                  {{ item }}
                </p>
              </div>
            </el-col>

            <!-- 产品服务 -->
            <el-col :span="5">
              <div class="footer-section">
                <h3>{{ footerData.services.title }}</h3>
                <ul>
                  <li
                    v-for="(item, index) in footerData.services.items"
                    :key="index"
                  >
                    <el-icon color="#79b2ff">
                      <component :is="item.icon" />
                    </el-icon>
                    {{ item.text }}
                  </li>
                </ul>
              </div>
            </el-col>

            <!-- 联系我们 -->
            <el-col :span="8">
              <div class="footer-section">
                <h3>{{ footerData.contact.title }}</h3>
                <p
                  v-for="(item, index) in footerData.contact.items"
                  :key="index"
                >
                  <el-icon color="#79b2ff">
                    <component :is="item.icon" />
                  </el-icon>
                  {{ item.text }}
                </p>
              </div>
            </el-col>

            <!-- 关注我们 -->
            <el-col :span="5">
              <div class="footer-section">
                <h3>{{ footerData.social.title }}</h3>
                <div class="social-links">
                  <div
                    v-for="(item, index) in footerData.social.items"
                    :key="index"
                    class="social-item"
                  >
                    <el-icon color="#79b2ff">
                      <component :is="item.icon" />
                    </el-icon>
                    <p>{{ item.text }}</p>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="copyright">
          <p>© 2024 AI语言合成教学平台 版权所有</p>
        </div>
      </div>
    </el-footer>
  </div>
</template>  

<script>
import { ref } from "vue";
import loginDialog from "../components/LoginDialog.vue";
import {
  Microphone,
  Document,
  Reading,
  Cellphone,
  ChatLineRound,
  ChatRound,
  Message,
  Phone,
  Location,
} from "@element-plus/icons-vue";
export default {
  components: {
    loginDialog,
  },
  data() {
    return {
      activeIndex: "1",
      carouselItems: [
        {
          id: 1,
          title: "智能生成PPT配音",
          description: "快速生成专业课件配音，提升教学效果",
        },
        {
          id: 2,
          title: "智能语言学习助手",
          description:
            "提供发音评测、语音模仿、节奏训练等全方位语言学习解决方案",
        },
        {
          id: 3,
          title: "智能语音合成",
          description: "打造专业的教学语音解决方案，让教学更生动",
        },
      ],
      features: [
        {
          title: "声音技术文档",
          description: "详细的声音技术资料，以助于理解。",
          icon: Microphone,
        },
        {
          title: "有声PP资料",
          description: "专业的有声资料库，供学习使用。",
          icon: Document,
        },
        {
          title: "预设文档助手",
          description: "高效的文档助手，快速生成所需资料。",
          icon: Reading,
        },
        {
          title: "语言学习助手",
          description: "多种语言学习助手，提升学习效果。",
          icon: Cellphone,
        },
      ],
      statistics: [
        { value: "10,000+", label: "注册用户" },
        { value: "50,000+", label: "文档阅读" },
        { value: "98%", label: "用户满意度" },
        { value: "24/7", label: "客服支持" },
      ],
      footerData: {
        about: {
          title: "关于我们",
          items: [
            "专注于教育领域的人工智能技术",
            "为教育工作者提供专业的语言解决方案",
            "打造智能化教学辅助工具",
          ],
        },
        services: {
          title: "产品服务",
          items: [
            { icon: Microphone, text: "声音样本库" },
            { icon: Document, text: "有声PPT制作" },
            { icon: Reading, text: "预览文本朗读" },
            { icon: Cellphone, text: "语言学习辅助" },
          ],
        },
        contact: {
          title: "联系我们",
          items: [
            { icon: Message, text: "邮箱：support@example.com" },
            { icon: Phone, text: "电话：400-123-4567" },
            { icon: Location, text: "地址：北京市海淀区XX路XX号" },
          ],
        },
        social: {
          title: "关注我们",
          items: [
            { icon: ChatLineRound, text: "官方微信" },
            { icon: ChatRound, text: "官方微博" },
          ],
        },
      },
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
  padding: 0;
}

.user-actions {
  display: flex;
  gap: 10px;
}

.hero {
  text-align: center;
  padding: 25px 0;
  padding-bottom: 0;
  background-color: #f5f7fa;
  height: 500px;
}
.hero .el-carousel {
  margin: 0 100px;
  height: 450px;
}

.el-carousel__item {
  background: linear-gradient(to right, #4b4b4b, #e3e3e3);
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  height: 450px;
}
.carousel-item-content {
  flex-direction: column;
  color: white;
  margin: 0;
  text-align: left;
  padding: 30px;
}

.features {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.feature-card el-row {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-card {
  background: #fff;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 20px;
  height: 300px;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
}

.feature-card.hover {
  transform: translateY(-10px);
  background: linear-gradient(to bottom, #cefcff, #e4fafc);
}

.feature-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 15px;
  color: #79b2ff;
  margin-top: 20px;
}

.feature-title {
  margin: 10px 0;
}

.feature-desc {
  margin: 0;
}

.statistics {
  padding: 30px 0;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
  justify-content: space-around;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.statistiс {
  width: 200px;
  text-align: center;
}
.statistiс h1 {
  background: linear-gradient(to right, #46b1f5, #39c4e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.statistiс p {
  font-size: 14px;
  color: #666666;
}
.footer-container {
  margin: 0 auto;
  padding: 0 15px;
}
.footer {
  background-color: var(--el-bg-color);
  height: 300px;
  padding: 40px 0 20px;
  border-top: 1px solid var(--el-border-color-lighter);
  width: 100%;
  display: flex;
  justify-content: center;
}

.footer-content {
  margin-bottom: 30px;
}

.footer-section {
  padding: 0 15px;
}

.footer-section h3 {
  color: var(--el-text-color-primary);
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: bold;
}

.footer-section p,
.footer-section li {
  color: var(--el-text-color-regular);
  line-height: 1.8;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-size: 13px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section .el-icon {
  margin-right: 8px;
  font-size: 16px;
}

.social-links {
  display: flex;
  gap: 20px;
}

.social-item {
  text-align: center;
}

.social-item .el-image {
  width: 16px;
  height: 16px;
  margin-bottom: 8px;
}

.copyright {
  text-align: center;
  color: var(--el-text-color-secondary);
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>