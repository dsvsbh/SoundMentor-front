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
          :disabled="isRecording"
          >播放示范</el-button
        >

        <div>
          <el-button
            type="default"
            @click="lastWord"
            :disabled="currentIndex === 0"
            >上一个</el-button
          >
          <el-button
            type="default"
            @click="nextWord"
            :disabled="currentIndex === wordList.length - 1"
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
import router from "@/router";
import { useRoute } from "vue-router";
import { ArrowLeft, VideoPlay, Microphone } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { getRandomWords } from "@/api/language";

const showResult = ref(false);
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

// 模拟单词列表
const wordList = ref([
  {
    word: "Perseverance",
    phonetic: "/ˌpɜː.sɪˈvɪə.rəns/",
    meaning: "n. 毅力",
  },
]);
const fetchWordList = async () => {
  try {
    const curLang = language.toUpperCase();
    const response = await getRandomWords({
      language: curLang,
      type: "WORD",
    });
    if (response && typeof response === "object") {
      wordList.value = [
        ...wordList.value,
        {
          word: response.content,
          phonetic: response.pronunciation,
          meaning: response.translation,
        },
      ];
    } else {
      console.warn("API 返回数据为空或格式不正确");
    }
  } catch (error) {
    ElMessage.error(`获取单词列表失败：${error.message}`);
  }
};

fetchWordList(); // 在组件加载时调用 fetchWordList

const currentIndex = ref(0);
const currentWord = ref(wordList.value[currentIndex.value]);

const grade = ref(0);
const feedback = ref("");
const highlightedText = ref("");

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
    resetEvaluation();
  }
};

// 切换到下一个单词
const nextWord = () => {
  fetchWordList();
  if (currentIndex.value < wordList.value.length - 1) {
    currentIndex.value++;
    currentWord.value = wordList.value[currentIndex.value];
    resetEvaluation();
  }
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
        recordedText.value = transcript.toLowerCase(); //全部小写
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

// 评估逻辑
const submitEvaluation = () => {
  const originalWord = currentWord.value.word;
  const userWord = recordedText.value;

  // 字符串比对并标红不同的字母
  let highlighted = "";
  for (let i = 0; i < originalWord.length; i++) {
    if (userWord[i] === originalWord[i]) {
      highlighted += originalWord[i];
    } else {
      highlighted += `<span style="color: red">${originalWord[i]}</span>`;
    }
  }

  highlightedText.value = highlighted;

  // 简单评分逻辑
  const correctLetters = userWord
    .split("")
    .filter((char, index) => char === originalWord[index]).length;
  grade.value = Math.round((correctLetters / originalWord.length) * 100);
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