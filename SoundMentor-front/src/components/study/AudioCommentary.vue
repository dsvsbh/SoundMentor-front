<template>
  <div class="study-container">
    <div class="comment-box">
      <div class="head">
        <text style="font-size: 22px; font-weight: bold">教学内容讲解</text>
        <el-button type="primary">智能分析</el-button>
      </div>
      <el-divider />
      <div input-box>
        <el-input
          placeholder="请输入或粘贴教学内容（800-2000字）"
          v-model="text"
          type="textarea"
          :autosize="{ minRows: 8, maxRows: 8 }"
        />
        <el-input
          v-model="geneText"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 6 }"
          style="margin: 20px 0"
        />
      </div>
      <div class="foot">
        <div class="words" style="color: #cccccc; font-size: 14px">
          当前字数： / 2000
        </div>
        <el-button @click="speak" class="gene-audio">生成语音</el-button>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref } from "vue";
import Footer from "../headFoot/Footer.vue";
const text = ref("");
const geneText = ref("这是自动生成讲解........");
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
.study-container {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 30px auto;
  border-radius: 15px;
  min-height: 70vh;
  width: 1135px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.comment-box {
  padding: 30px;
}
.head {
  display: flex;
  justify-content: space-between;
}
.foot {
  display: flex;
  justify-content: space-between;
}
</style>