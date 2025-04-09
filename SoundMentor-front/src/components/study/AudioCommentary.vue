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
          resize="none"
        />
        <el-input
          v-model="geneText"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 6 }"
          style="margin: 20px 0"
          resize="none"
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
  <!-- 生成记录 -->
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
      <div class="item" v-for="(item, index) in paginatedItems" :key="index">
        <div class="left-info">
          <el-checkbox v-model="item.checked" size="large" />
          <div class="ico">
            <el-icon size="30" color="#ffffff"><Document /></el-icon>
          </div>
          <div class="info">
            <span style="font-size: 18px; font-weight: bold">{{
              item.name
            }}</span>
            <div style="display: flex; gap: 10px; color: #c0c4cc">
              <span>{{ item.date }}</span>
              <span>{{ item.format }}</span>
              <span>{{ item.duration }}</span>
            </div>
          </div>
        </div>
        <div class="right-btn">
          <audio :src="item.audioSrc" controls></audio>
          <div style="display: flex; gap: 30px">
            <el-link type="primary" href="">
              <el-icon><Download /></el-icon>下载
            </el-link>
            <el-link type="primary" href="">
              <!-- TODO 删除音频 -->
              <el-icon><Delete /></el-icon>删除
            </el-link>
          </div>
        </div>
      </div>
    </div>

    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalItems"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </div>
  <Footer />
</template>

<script setup>
import Footer from "../headFoot/Footer.vue";
import { ref, computed } from "vue";
import {
  Operation,
  Headset,
  VideoPlay,
  Delete,
  Download,
  Document,
} from "@element-plus/icons-vue";
import { ElCheckbox, ElLink, ElIcon, ElPagination } from "element-plus";

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

const audioList = [
  {
    name: "示例文本1.mp3",
    date: "2025.4.1",
    format: "MP3",
    duration: "3:30",
    audioSrc: "/audio/example1.mp3",
    checked: false,
  },
  {
    name: "示例文本2.mp3",
    date: "2025.4.2",
    format: "MP3",
    duration: "4:00",
    audioSrc: "/audio/example2.mp3",
    checked: false,
  },
  {
    name: "示例文本3.mp3",
    date: "2025.4.3",
    format: "MP3",
    duration: "2:15",
    audioSrc: "/audio/example3.mp3",
    checked: false,
  },
  {
    name: "示例文本4.mp3",
    date: "2025.4.4",
    format: "MP3",
    duration: "5:10",
    audioSrc: "/audio/example4.mp3",
    checked: false,
  },
  {
    name: "示例文本5.mp3",
    date: "2025.4.5",
    format: "MP3",
    duration: "3:50",
    audioSrc: "/audio/example5.mp3",
    checked: false,
  },
  {
    name: "示例文本6.mp3",
    date: "2025.4.6",
    format: "MP3",
    duration: "4:20",
    audioSrc: "/audio/example6.mp3",
    checked: false,
  },
  {
    name: "示例文本7.mp3",
    date: "2025.4.7",
    format: "MP3",
    duration: "2:45",
    audioSrc: "/audio/example7.mp3",
    checked: false,
  },
  {
    name: "示例文本8.mp3",
    date: "2025.4.8",
    format: "MP3",
    duration: "3:30",
    audioSrc: "/audio/example8.mp3",
    checked: false,
  },
  {
    name: "示例文本9.mp3",
    date: "2025.4.9",
    format: "MP3",
    duration: "4:05",
    audioSrc: "/audio/example9.mp3",
    checked: false,
  },
  {
    name: "示例文本10.mp3",
    date: "2025.4.10",
    format: "MP3",
    duration: "5:15",
    audioSrc: "/audio/example10.mp3",
    checked: false,
  },
];
const currentPage = ref(1);
const pageSize = ref(5);
const totalItems = ref(audioList.length);

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return audioList.slice(start, start + pageSize.value);
});

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
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
.down-box {
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  min-height: 60vh;
  width: 1135px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.head {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
.audio-control {
  background-color: #f9f9f9;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 20px 0;
  gap: 15px;
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
.el-pagination {
  justify-content: center;
  margin-bottom: 20px;
}
</style>