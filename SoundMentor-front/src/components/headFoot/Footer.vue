<template>
  <el-footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div
          class="top-bar"
          style="
            height: 3px;
            width: 1100px;
            background: linear-gradient(to right, #e0e3e7, #f0f2f5);
          "
        ></div>
        <el-row :gutter="10" style="width: 1100px">
          <!-- 关于我们 -->
          <el-col :span="6">
            <div class="footer-section">
              <h3>{{ footerData.about.title }}</h3>
              <div class="bar"></div>
              <p v-for="(item, index) in footerData.about.items" :key="index">
                {{ item }}
              </p>
            </div>
          </el-col>

          <!-- 产品服务 -->
          <el-col :span="5">
            <div class="footer-section">
              <h3>{{ footerData.services.title }}</h3>
              <div class="bar"></div>
              <ul>
                <li
                  v-for="(item, index) in footerData.services.items"
                  :key="index"
                >
                  <el-icon color="#79b2ff">
                    <component :is="item.icon" />
                  </el-icon>
                  <a
                    :href="getLink(item.text)"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </div>
          </el-col>

          <!-- 联系我们 -->
          <el-col :span="8">
            <div class="footer-section">
              <h3>{{ footerData.contact.title }}</h3>
              <div class="bar"></div>
              <p v-for="(item, index) in footerData.contact.items" :key="index">
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
              <div class="bar"></div>
              <div class="social-links">
                <div
                  v-for="(item, index) in footerData.social.items"
                  :key="index"
                  class="social-item"
                >
                  <el-icon color="#79b2ff" style="margin-top: 20px" size="20">
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
        <text>© 2024 AI语音合成教学平台 版权所有</text>
      </div>
    </div>
  </el-footer>
</template>

<script>
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
  name: "Footer",
  data() {
    return {
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
    getLink(serviceText) {
      switch (serviceText) {
        case "声音样本库":
          return "/docs";
        case "有声PPT制作":
          return "/ppt";
        case "预览文本朗读":
          return "TextReading";
        case "语言学习辅助":
          return "LanguageLearning";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped>
.footer-container {
  margin: 0 auto;
  padding: 0 15px;
}
.footer {
  background-color: var(--el-bg-color);
  height: 330px;
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
.footer-section .bar {
  height: 3px;
  width: 40px;
  background: linear-gradient(to right, #46b1f5, #39c4e5);
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

.footer-section a {
  text-decoration: none;
  color: var(--el-text-color-regular);
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