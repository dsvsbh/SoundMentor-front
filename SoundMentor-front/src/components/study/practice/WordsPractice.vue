<template>
  <div class="container">
    <div class="head">
      <div class="back-up" @click="back">
        <el-icon><ArrowLeft /></el-icon>返回语音选择
      </div>
      <!-- TODO 语言埋点 -->
      <div class="title">
        <span>英文 - 单词练习</span>
        <div class="bar"></div>
      </div>
    </div>
    <div class="word-box">
      <div class="word">
        <!-- TODO 单词列表埋点 -->
        <span style="font-size: 50px">Perseverance</span>
        <span style="font-size: 30px">/..../</span>
        <span style="font-size: 30px">n. xxxx</span>
      </div>
      <div class="buttons">
        <el-button type="primary" :icon="VideoPlay" plain>播放示范</el-button>
        <div>
          <el-button type="default">下一个</el-button>
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
import router from "@/router";
import { ArrowLeft, VideoPlay, Microphone } from "@element-plus/icons-vue";
import { ref } from "vue";

const showResult = ref(true);

// 返回上一级
const back = () => {
  router.back();
};
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
.word-box {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  border-radius: 10px;
  border: 1px solid #ebebeb;
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