<template>
  <div class="up-box">
    <div class="left-box">
      <div class="head">
        <text style="font-size: 22px; font-weight: bold; color: #5d5d5d"
          >文本朗读</text
        >
        <el-button type="primary">生成语音</el-button>
      </div>
      <el-divider />
      <el-input
        placeholder="请输入或粘贴教学内容（800-2000字）"
        v-model="text"
        type="textarea"
        :autosize="{ minRows: 16, maxRows: 16 }"
        style="width: 93%; margin: 0 25px"
        resize="none"
      />
      <div
        class="words"
        style="color: #cccccc; font-size: 14px; margin: 15px 25px"
      >
        当前字数： / 2000
      </div>
    </div>
    <div class="right-box">
      <div class="title">
        <el-icon size="20"><Operation /></el-icon>
        <div style="font-size: 18px">基础设置</div>
      </div>
      <p style="color: #606266">语言选择</p>
      <el-select v-model="value" placeholder="请选择语言" style="width: 200px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <p style="color: #606266">语速调节</p>
      <el-button-group class="btns">
        <el-button>慢速</el-button>
        <el-button>正常</el-button>
        <el-button>快速</el-button>
      </el-button-group>
      <el-slider :max="2" :min="0.5" :step="0.1" v-model="speed"></el-slider>
      <el-divider />
      <div class="title">
        <el-icon size="20"><Headset /></el-icon>
        <div style="font-size: 18px">音频设置</div>
      </div>
      <div class="audio-control">
        <el-button-group class="btns">
          <el-button>-15s</el-button>
          <el-button><VideoPlay />播放</el-button>
          <el-button>+15s</el-button>
        </el-button-group>
        <el-slider
          :max="100"
          :min="0"
          :step="1"
          v-model="audioProgress"
          style="width: 80px"
        ></el-slider>
      </div>
      <el-button type="primary" style="width: 100%">生成语音</el-button>
    </div>
  </div>
  <div class="down-box">
    <div
      class="head"
      style="border-bottom: 1.5px solid #dcdfe6; padding-bottom: 20px"
    >
      <text style="font-size: 22px; font-weight: bold; color: #5d5d5d"
        >生成记录</text
      >
      <el-button type="primary">批量下载</el-button>
    </div>
    <div class="list">
      <div class="item">
        <div class="left-info">
          <el-checkbox v-model="checked1" size="large" />
          <div class="ico">
            <el-icon size="30" color="#ffffff"><Document /></el-icon>
          </div>
          <div class="info">
            <span style="font-size: 18px; font-weight: bold">示例文本.mp3</span>
            <div style="display: flex; gap: 10px; color: #c0c4cc">
              <span>2025.4.8</span>
              <span>MP3</span>
              <span>3:48</span>
            </div>
          </div>
        </div>
        <div class="right-btn">
          <audio :src="'/audio/example.mp3'" controls></audio>
          <div style="display: flex; gap: 30px">
            <el-link type="primary"
              ><el-icon><Download /></el-icon>下载</el-link
            >
            <el-link type="primary"
              ><el-icon><Delete /></el-icon>删除</el-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>
<script setup>
import Footer from "@/components/headFoot/Footer.vue";
import {
  Operation,
  Headset,
  VideoPlay,
  Delete,
  Download,
  Document,
} from "@element-plus/icons-vue";
import { ref } from "vue";

const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];

const speed = ref(1);
const audioProgress = ref(1);
</script>
<style scoped>
.up-box {
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin: 30px auto;
  min-height: 70vh;
  width: 1180px;
}
.left-box {
  flex: 3;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.head {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
.right-box {
  flex: 1.2;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.title {
  display: flex;
  gap: 5px;
  align-items: center;
}
.down-box {
  display: flex;
  flex-direction: column;
  margin: 40px auto;
  min-height: 60vh;
  width: 1180px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.audio-control {
  background-color: #f9f9f9;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 20px 0;
  gap: 10px;
  flex: 3;
}
.list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  padding-top: 0;
}
.item {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #dcdfe6;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
}
.left-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.right-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 50px;
}
.ico {
  background-color: #c0c4cc;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>