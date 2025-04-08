<template>
  <div class="container">
    <div class="head">
      <div class="back-up" @click="back">
        <el-icon><ArrowLeft /></el-icon>返回语音选择
      </div>
      <!-- TODO 语言埋点 -->
      <div class="title">
        <span>英文 - 演讲练习</span>
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
      <!-- TODO 滚动展示，每次展示5条 -->
      <div
        class="list"
        v-for="(item, index) in displayedSpeechList"
        :key="index"
        :class="{ highlight: index === highlightIndex }"
      >
        <div>{{ item }}</div>
      </div>
      <div class="buttons">
        <el-button type="primary" :icon="VideoPlay" plain>播放示范</el-button>
        <div>
          <el-button type="default" @click="nextPage" v-if="hasNextHighlight"
            >下一个</el-button
          >
          <el-button :icon="Microphone" type="success">开始录音</el-button>
          <el-button type="primary">提交评估</el-button>
        </div>
      </div>
    </div>
    <div class="result" v-if="showResult">
      <div class="result-box">
        <span class="title" style="font-weight: bold; margin-bottom: 20px"
          >评估结果</span
        >
        <span class="grade" style="font-size: 80px; font-weight: bold"
          >93分</span
        >
        <span class="rate">发音不错</span>
      </div>
      <div class="suggest">
        <span>改进建议</span>
        <div class="suggest-content">{}</div>
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

const back = () => {
  router.back();
};
const speechContent =
  "尊敬的各位老师、亲爱的同学们：大家好！今天我想和大家分享一个重要的话题——如何积极面对挑战。有些挑战像高山一样巍峨，让我们感到难以攀登；另一些挑战则像暴风雨，来得突然且猛烈，让我们措手不及。然而，正是这些挑战，塑造了我们的品格，锻炼了我们的意志。";
const speechList = ref([]);

const handleSpeech = (content) => {
  const parts = content
    .split(/[。；、！.，——]/)
    .filter((part) => part.trim() !== "");
  parts.forEach((part) => {
    speechList.value.push(part.trim());
  });
};

const pageSize = 5;
const currentPage = ref(0);
const highlightIndex = ref(0);

const displayedSpeechList = computed(() => {
  const start = currentPage.value * pageSize;
  const end = start + pageSize;
  return speechList.value.slice(start, end);
});

const hasNextHighlight = computed(() => {
  return (
    highlightIndex.value < displayedSpeechList.value.length - 1 ||
    hasNextPage.value
  );
});

const hasNextPage = computed(() => {
  return (currentPage.value + 1) * pageSize < speechList.value.length;
});

const nextPage = () => {
  if (highlightIndex.value < displayedSpeechList.value.length - 1) {
    highlightIndex.value++;
  } else if (hasNextPage.value) {
    currentPage.value++;
    highlightIndex.value = 0;
  }
};

const showResult = ref(true);
onMounted(() => {
  handleSpeech(speechContent);
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 30px auto;
  border-radius: 15px;
  min-height: 100vh;
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