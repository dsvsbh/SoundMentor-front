<template>
  <div class="comment-box">
    <div class="head">
      <text>教学内容讲解</text>
      <el-button>智能分析</el-button>
    </div>
    <div input-box>
      <el-input
        placeholder="请输入或战区教学内容（800-2000字）"
        v-model="text"
      ></el-input>
    </div>
    <div class="foot">
      <div class="words"></div>
      <el-button @click="speak">生成语音</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const text = ref("");
const speak = () => {
  if (!text.value) {
    alert("请输入要朗读的文本！");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text.value);
  utterance.lang = "zh-CN"; // 设置语言为中文
  speechSynthesis.speak(utterance);
};
</script>

<style scoped>
.comment-box {
  padding: 30px;
}
</style>