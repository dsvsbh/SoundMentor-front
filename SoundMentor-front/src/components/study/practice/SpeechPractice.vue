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
      <!-- 滚动展示，每次展示5条 -->
      <div
        class="list"
        v-for="(item, index) in displayedSpeechList"
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
          @click="speak(displayedSpeechList[highlightIndex])"
          :disabled="isRecording"
          >播放示范</el-button
        >
        <div>
          <el-button
            type="default"
            @click="lastPage"
            :disabled="!hasPreHighlight"
            >上一个</el-button
          >
          <el-button
            type="default"
            @click="nextPage"
            :disabled="!hasNextHighlight"
            >下一个</el-button
          >
          <el-button
            :type="isRecording ? 'danger' : 'primary'"
            @click="toggleRecording"
          >
            {{ isRecording ? "停止录音" : "开始录音" }}
          </el-button>

          <el-button
            type="primary"
            :disabled="!recordedText"
            @click="submitEvaluation"
            >提交评估</el-button
          >
        </div>
      </div>
    </div>

    <div class="result" v-if="showResult">
      <div class="result-box">
        <span class="title" style="font-weight: bold; margin-bottom: 20px"
          >评估结果</span
        >
        <span class="grade" style="font-size: 80px; font-weight: bold"
          >{{ grade }}分</span
        >
        <span class="rate">{{ feedback }}</span>
      </div>
      <div class="suggest">
        <span>改进建议</span>
        <div class="suggest-content" v-html="highlightedText"></div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import Footer from "@/components/headFoot/Footer.vue";
import { ArrowLeft, VideoPlay, Microphone } from "@element-plus/icons-vue";
import { onMounted, ref, computed } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { getRandomWords } from "@/api/language";

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

// 获取朗诵内容
const fetchSpeechContent = async () => {
  try {
    const curLang = language === 'english' ? 'ENGLISH' : 'CHINESE';
    const response = await getRandomWords({
      language: curLang,
      type: "POETRY",
    });

    if (response && typeof response === "object" && response.content) {
      speechContent.value = response.content;
      handleSpeech(speechContent.value);
    } else {
      console.warn("API 返回数据为空或格式不正确");
      ElMessage.warning("获取朗诵内容失败，请重试");
    }
  } catch (error) {
    ElMessage.error(`获取朗诵内容失败：${error.message}`);
  }
};

// 处理朗诵内容，分割成句子
const handleSpeech = (content) => {
  // 使用正则表达式分隔内容
  const parts = content
    .split(/[\n，。]+/)
    .map((item) => item.trim())
    .filter((item) => item !== "");
  speechList.value = parts;
};

// 组件加载时获取朗诵内容
onMounted(() => {
  fetchSpeechContent();
});

const pageSize = 5;
const currentPage = ref(0);
const highlightIndex = ref(0);

// 展示当前页面的文本列表
const displayedSpeechList = computed(() => {
  const start = currentPage.value * pageSize;
  const end = start + pageSize;
  return speechList.value.slice(start, end);
});
const hasPreHighlight = computed(() => {
  return highlightIndex.value > 0 || hasPrePage.value;
});

const hasPrePage = computed(() => {
  return (currentPage.value - 1) * pageSize > speechList.value.length;
});

// 高亮文本
const hasNextHighlight = computed(() => {
  return (
    highlightIndex.value < displayedSpeechList.value.length - 1 ||
    hasNextPage.value
  );
});

const hasNextPage = computed(() => {
  return (currentPage.value + 1) * pageSize < speechList.value.length;
});
const lastPage = () => {
  if (highlightIndex.value > 0) {
    highlightIndex.value--;
    resetEvaluation();
  } else if (hasNextPage.value) {
    currentPage.value--;
    highlightIndex.value = 4;
  }
};

const nextPage = () => {
  if (highlightIndex.value < displayedSpeechList.value.length - 1) {
    highlightIndex.value++;
    resetEvaluation();
  } else if (hasNextPage.value) {
    currentPage.value++;
    highlightIndex.value = 0;
  }
};

const showResult = ref(false);
const grade = ref(0);
const feedback = ref("");
const highlightedText = ref("");

const speak = (sentence) => {
  console.log(sentence);
  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = languageMap[language] || "en-US";
  speechSynthesis.speak(utterance);
};
// 状态管理
const isRecording = ref(false);
const recordedText = ref("");
let recognition;

const initializeSpeechRecognition = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    ElMessage.error("您的浏览器不支持 Web Speech API");
    return;
  }

  // 请求麦克风权限
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(() => {
      console.log("麦克风权限已授予");

      recognition = new SpeechRecognition();
      recognition.lang = languageMap[language] || "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // 获取识别结果
        recordedText.value = transcript;
      };

      recognition.onerror = (event) => {
        ElMessage.warning("语音识别错误: 无法识别");
        console.error("SpeechRecognitionError:", event);
      };

      recognition.onend = () => {
        isRecording.value = false;
      };
    })
    .catch((error) => {
      console.error("麦克风权限被拒绝:", error);
      ElMessage.error("无法访问麦克风，请检查浏览器设置");
    });
};

// 开始录音
const startRecording = () => {
  if (!recognition) {
    initializeSpeechRecognition();
  }
  recordedText.value = ""; // 重置识别结果
  isRecording.value = true;
  recognition.start(); // 开始语音识别
};

// 停止录音
const stopRecording = () => {
  if (recognition) {
    recognition.stop(); // 停止语音识别
    isRecording.value = false;
  }
};

// 切换录音状态
const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

const submitEvaluation = () => {
  const currentSentence = displayedSpeechList.value[highlightIndex.value];

  // 确保 currentSentence 是有效的
  if (!currentSentence) {
    ElMessage.error("当前句子无效，无法进行评估。");
    return;
  }

  console.warn(currentSentence);
  const userWord = recordedText.value;
  console.log(userWord);

  // 字符串比对并标红不同的字母
  let highlighted = "";
  for (let i = 0; i < currentSentence.length; i++) {
    if (userWord[i] === currentSentence[i]) {
      highlighted += currentSentence[i];
    } else {
      highlighted += `<span style="color: red">${currentSentence[i]}</span>`;
    }
  }

  highlightedText.value = highlighted;

  // 简单评分逻辑
  const correctLetters = userWord
    .split("")
    .filter((char, index) => char === currentSentence[index]).length;
  grade.value = Math.round((correctLetters / currentSentence.length) * 100);
  feedback.value = grade.value > 80 ? "发音不错" : "需要加强发音练习";

  showResult.value = true;
};

// 重置评估状态
const resetEvaluation = () => {
  recordedText.value = "";
  showResult.value = false;
  grade.value = 0;
  feedback.value = "";
  highlightedText.value = "";
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