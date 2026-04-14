<template>
  <div class="container">
    <div class="head">
      <div class="back-up" @click="back">
        <el-icon><ArrowLeft /></el-icon>返回语音选择
      </div>
      <div class="title">
        <span>{{ language === "english" ? "英文" : "中文" }} - 朗诵练习</span>
        <div class="bar"></div>
      </div>
    </div>
    <div class="info">
      <div class="info-content">
        <span>时长：5分钟</span>
        <span>句子数：{{ speechList.length }}</span>
        <span>难度：中等</span>
      </div>
    </div>
    <div class="content">
      <!-- 滚动展示所有诗句 -->
      <div
        class="list"
        v-for="(item, index) in speechList"
        :key="index"
        :class="{ highlight: index === highlightIndex }"
      >
        <div>{{ item }}</div>
      </div>

      <div class="buttons">
        <el-button
          type="primary"
          :icon="VideoPlay"
          plain
          @click="speak(speechList[highlightIndex])"
          >播放示范</el-button
        >
        <div>
          <el-button
            type="default"
            @click="prevSentence"
            :disabled="highlightIndex <= 0"
            >上一句</el-button
          >
          <el-button
            type="default"
            @click="nextSentence"
            :disabled="highlightIndex >= speechList.length - 1"
            >下一句</el-button
          >
          <el-button
            type="default"
            @click="prevPoem"
            :disabled="poemHistory.length <= 1"
            >上一首</el-button
          >
          <el-button
            type="default"
            @click="nextPoem"
            >下一首</el-button
          >
          <el-button
            type="primary"
            @click="showAddContentDialog"
            >向系统添加{{ language === "english" ? "诗歌" : "诗词" }}</el-button
          >
        </div>
      </div>
    </div>


  </div>

  <!-- 向系统添加内容弹窗 -->
  <el-dialog
    v-model="addContentDialogVisible"
    :title="'向系统添加' + (language === 'english' ? '诗歌' : '诗词')"
    width="500px"
  >
    <el-form 
      ref="addContentFormRef"
      :model="addContentForm" 
      :rules="addContentRules"
      label-width="80px"
    >
      <el-form-item label="内容" prop="content">
        <el-input 
          v-model="addContentForm.content" 
          type="textarea" 
          rows="6" 
          placeholder="请输入内容，每行诗句需要换行"
        />
        <div style="color: #909399; font-size: 12px; margin-top: 5px;">
          提示：每行诗句需要换行
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addContentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addContentToSystem">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <Footer />
</template>

<script setup>
import Footer from "@/components/headFoot/Footer.vue";
import { ArrowLeft, VideoPlay } from "@element-plus/icons-vue";
import { onMounted, ref, computed } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton } from "element-plus";
import { getRandomWords, uploadLangContent } from "@/api/language";

const route = useRoute();
const language = route.query.language;
const languageMap = {
  english: "en-US",
  chinese: "zh-CN",
};
const back = () => {
  router.back();
};

const speechContent = ref("");
const speechList = ref([]);
const poemHistory = ref([]); // 存储历史诗歌
const currentPoemIndex = ref(-1); // 当前诗歌在历史记录中的索引
const highlightIndex = ref(0); // 当前高亮的诗句索引

// 获取朗诵内容
const fetchSpeechContent = async () => {
  try {
    const curLang = language === 'english' ? 'ENGLISH' : 'CHINESE';
    const response = await getRandomWords({
      language: curLang,
      type: "POETRY",
    });

    if (response && typeof response === "object" && response.content) {
      const poem = {
        content: response.content,
        sentences: []
      };
      // 处理诗歌内容，分割成句子
      poem.sentences = response.content
        .split(/[\n，。]+/)
        .map((item) => item.trim())
        .filter((item) => item !== "");
      
      // 添加到历史记录
      poemHistory.value.push(poem);
      currentPoemIndex.value = poemHistory.value.length - 1;
      
      // 更新当前显示的内容
      speechContent.value = response.content;
      speechList.value = poem.sentences;
      highlightIndex.value = 0; // 重置诗句索引
    } else {
      console.warn("API 返回数据为空或格式不正确");
      ElMessage.warning("获取朗诵内容失败，请重试");
    }
  } catch (error) {
    ElMessage.error(`获取朗诵内容失败：${error.message}`);
  }
};

// 组件加载时获取朗诵内容
onMounted(() => {
  fetchSpeechContent();
});

// 上一句
const prevSentence = () => {
  if (highlightIndex.value > 0) {
    highlightIndex.value--;
  }
};

// 下一句
const nextSentence = () => {
  if (highlightIndex.value < speechList.value.length - 1) {
    highlightIndex.value++;
  }
};

// 上一首
const prevPoem = () => {
  if (currentPoemIndex.value > 0) {
    currentPoemIndex.value--;
    const poem = poemHistory.value[currentPoemIndex.value];
    speechContent.value = poem.content;
    speechList.value = poem.sentences;
    highlightIndex.value = 0;
  }
};

// 下一首
const nextPoem = () => {
  if (currentPoemIndex.value < poemHistory.value.length - 1) {
    // 如果有下一首，直接切换
    currentPoemIndex.value++;
    const poem = poemHistory.value[currentPoemIndex.value];
    speechContent.value = poem.content;
    speechList.value = poem.sentences;
    highlightIndex.value = 0;
  } else {
    // 否则请求新的诗歌
    fetchSpeechContent();
  }
};

const speak = (sentence) => {
  console.log(sentence);
  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = languageMap[language] || "en-US";
  speechSynthesis.speak(utterance);
};

// 向系统添加内容弹窗
const addContentDialogVisible = ref(false);
const addContentForm = ref({
  content: ''
});
const addContentFormRef = ref(null);

// 表单验证规则
const addContentRules = ref({
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ]
});

const showAddContentDialog = () => {
  // 清空表单，不自动填充内容
  addContentForm.value = {
    content: ''
  };
  addContentDialogVisible.value = true;
};

// 向系统添加内容
const addContentToSystem = async () => {
  // 表单验证
  if (!addContentFormRef.value) return;
  
  addContentFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await uploadLangContent({
          content: addContentForm.value.content,
          pronunciation: '', // 诗歌不需要音标
          translation: '', // 诗歌不需要翻译
          language: language === 'english' ? 'ENGLISH' : 'CHINESE',
          type: 'POETRY'
        });
        
        if (response.code === '0') {
          ElMessage.success('成功添加到系统');
          addContentDialogVisible.value = false;
        } else {
          ElMessage.error('添加失败: ' + response.message);
        }
      } catch (error) {
        console.error('添加内容失败:', error);
        ElMessage.error('添加失败，请重试');
      }
    } else {
      ElMessage.warning('请填写所有必填项');
      return false;
    }
  });
};

// 重置评估状态
const resetEvaluation = () => {
  // 不再需要重置评估状态
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 30px auto;
  border-radius: 15px;
  min-height: 80vh;
  width: 1135px;
  align-items: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.head {
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  margin: 20px;
  border-bottom: solid 1px #ebebeb;
  color: #5d5d5d;
  .back-up {
    cursor: pointer;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    width: 160px;
    .bar {
      width: 100%;
      height: 5px;
      background: linear-gradient(to right, #409ffe, #37d0de);
    }
  }
}
.info {
  width: 90%;
  border-radius: 10px;
  background-color: #f5f7fa;
  margin: 20px;
  height: 50px;
  display: flex;
  align-items: center;
  .info-content {
    color: #5d5d5d;
    padding: 20px;
    display: flex;
    flex-direction: row;
    font-size: 14px;
    gap: 20px;
  }
}

.content {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  border-radius: 10px;
  border: 1px solid #ebebeb;
  margin-bottom: 30px;
  .list {
    padding: 20px;
    min-height: 20px;
  }
  .highlight {
    font-size: 18px; /* 设置为更大的字体 */
    color: #409eff; /* 设置颜色为 #409eff */
  }
  .buttons {
    width: 92%;
    background-color: #f5f7fa;
    border-radius: 10px;
    margin: 20px;
    margin-top: 0;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
}
.result {
  flex: 2;
  margin: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  width: 90%;
  margin-bottom: 40px;
  .result-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to right, #46b1f5, #39c4e5);
    color: white;
    height: 260px;
    border-radius: 10px 10px 0 0;
  }
  .suggest {
    padding: 20px;
  }
}
</style>