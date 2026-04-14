<template>
  <div class="container">
    <div class="head">
      <div class="back-up" @click="back">
        <el-icon><ArrowLeft /></el-icon>返回语音选择
      </div>
      <div class="title">
        <span>{{ language === "english" ? "英文" : "中文" }} - 单词练习</span>
        <div class="bar"></div>
      </div>
    </div>
    <div class="word-box">
      <div class="word">
        <span style="font-size: 50px">{{ currentWord.word }}</span>
        <span style="font-size: 30px">{{ currentWord.phonetic }}</span>
        <span style="font-size: 30px">{{ currentWord.meaning }}</span>
      </div>
      <div class="buttons">
        <el-button
          type="primary"
          :icon="VideoPlay"
          plain
          @click="speak(currentWord.word)"
          >播放示范</el-button
        >

        <div>
          <el-button
            type="default"
            @click="lastWord"
            :disabled="currentIndex <= 0"
            >上一个</el-button
          >
          <el-button
            type="default"
            @click="nextWord"
            >下一个</el-button
          >
          <el-button
            type="primary"
            @click="showAddContentDialog"
            >向系统添加{{ language === "english" ? "单词" : "词语" }}</el-button
          >
        </div>
      </div>
    </div>

  </div>

  <!-- 向系统添加内容弹窗 -->
  <el-dialog
    v-model="addContentDialogVisible"
    :title="'向系统添加' + (language === 'english' ? '单词' : '词语')"
    width="500px"
  >
    <el-form 
      ref="addContentFormRef"
      :model="addContentForm" 
      :rules="addContentRules"
      label-width="80px"
    >
      <el-form-item label="内容" prop="content">
        <el-input v-model="addContentForm.content" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="发音">
        <el-input v-model="addContentForm.pronunciation" placeholder="请输入发音" />
      </el-form-item>
      <el-form-item label="翻译">
        <el-input v-model="addContentForm.translation" placeholder="请输入翻译" />
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
import router from "@/router";
import { useRoute } from "vue-router";
import { ArrowLeft, VideoPlay } from "@element-plus/icons-vue";
import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton } from "element-plus";
import { ref, onMounted } from "vue";
import { getRandomWords, uploadLangContent } from "@/api/language";

const route = useRoute();
const language = route.query.language;

const languageMap = {
  english: "en-US",
  chinese: "zh-CN",
  french: "fr-FR",
  spanish: "es-ES",
};

// 返回上一级
const back = () => {
  router.back();
};

// 单词列表
const wordList = ref([]);
const currentIndex = ref(-1);
const currentWord = ref({});

// 获取单词列表
const fetchWordList = async () => {
  try {
    const curLang = language === 'english' ? 'ENGLISH' : 'CHINESE';
    const response = await getRandomWords({
      language: curLang,
      type: "WORD",
    });
    if (response && typeof response === "object") {
      const newWord = {
        word: response.content,
        phonetic: response.pronunciation,
        meaning: response.translation,
      };
      // 将新单词添加到列表中，而不是重置整个数组
      wordList.value.push(newWord);
      currentIndex.value = wordList.value.length - 1;
      currentWord.value = newWord;
    } else {
      console.warn("API 返回数据为空或格式不正确");
      ElMessage.warning("获取单词失败，请重试");
    }
  } catch (error) {
    ElMessage.error(`获取单词列表失败：${error.message}`);
  }
};

// 组件加载时获取单词
onMounted(() => {
  fetchWordList();
});



const speak = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = languageMap[language] || "en-US";
  speechSynthesis.speak(utterance);
};

// 切换到上一个单词
const lastWord = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    currentWord.value = wordList.value[currentIndex.value];
  } else {
    ElMessage.info("已经是第一个单词了");
  }
};

// 切换到下一个单词
const nextWord = () => {
  if (currentIndex.value < wordList.value.length - 1) {
    // 如果有下一个单词，直接切换
    currentIndex.value++;
    currentWord.value = wordList.value[currentIndex.value];
  } else {
    // 否则请求新的单词
    fetchWordList();
  }
};

// 向系统添加内容弹窗
const addContentDialogVisible = ref(false);
const addContentForm = ref({
  content: '',
  pronunciation: '',
  translation: ''
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
    content: '',
    pronunciation: '',
    translation: ''
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
          pronunciation: addContentForm.value.pronunciation,
          translation: addContentForm.value.translation,
          language: language === 'english' ? 'ENGLISH' : 'CHINESE',
          type: 'WORD'
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
.word-box {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  border-radius: 10px;
  border: 1px solid #ebebeb;
  margin-bottom: 30px;
  .word {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 96%;
    height: 260px;
    background-color: #f5f7fa;
    border-radius: 10px;
    margin: 20px;
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