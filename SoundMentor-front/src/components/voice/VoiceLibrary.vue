<template>
  <div class="voice-library">
    <!-- 搜索框 -->
    <div class="search-bar">
      <el-input
        placeholder="搜索音频库"
        prefix-icon="el-icon-search"
        v-model="searchQuery"
      ></el-input>
    </div>
    <!-- 标签页 -->
    <el-tabs v-model="activeSubTab" class="tabs">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="预设" name="preset"></el-tab-pane>
      <el-tab-pane label="自定义" name="custom"></el-tab-pane>
      <el-tab-pane label="收藏" name="favorites"></el-tab-pane>
    </el-tabs>

    <!-- 音频列表 -->
    <div class="audio-items">
      <!-- 音频卡片 -->
      <div
        class="audio-card"
        v-for="(audio, index) in filteredAudioList"
        :key="index"
      >
        <div class="audio-card-header">
          <h3>{{ audio.title }}</h3>
          <el-tag color="#79b2ff" effect="dark">
            <component :is="audio.tag" />
            {{ audio.tagContent }}
          </el-tag>
        </div>
        <p>{{ audio.description }}</p>
        <el-rate v-model="audio.rating" disabled></el-rate>
        <el-slider
          v-model="audio.speed"
          max="2"
          min="0.5"
          step="0.1"
        ></el-slider>
        <div class="action-buttons">
          <el-button @click="playAudio(audio)">
            <el-icon color="#24a3ff" v-if="!audio.isPlaying">
              <VideoPlay />
            </el-icon>
            <el-icon color="#24a3ff" v-else>
              <VideoPause />
            </el-icon>
            {{ audio.isPlaying ? "暂停" : "试听" }}
          </el-button>
          <el-button @click="downloadAudio(audio)">
            <el-icon color="#24a3ff"><Download /></el-icon>
            下载
          </el-button>
          <el-button @click="toggleFavorite(audio)">
            <el-icon color="#24a3ff" v-if="audio.isFavorite">
              <StarFilled />
            </el-icon>
            <el-icon color="#24a3ff" v-else>
              <Star />
            </el-icon>
            {{ audio.isFavorite ? "取消收藏" : "收藏" }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Star,
  VideoPlay,
  Download,
  VideoPause,
  StarFilled,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getSoundLibList } from "@/api/voice";
import { getSoundLib } from "@/api/voice";

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const activeSubTab = ref("all");
const searchQuery = ref("");
const audioList = ref([
  {
    title: "海韵自然的男声",
    description: "适合各类学习场景",
    tag: "primary",
    tagContent: "自定义",
    rating: 4.9,
    speed: 1.0,
    emotion: "neutral",
    isFavorite: false,
    isPlaying: false,
  },
]);

const preAudio = ref([]);
const userAudio = ref([]);
onMounted(async () => {
  fetchSoundLibList();
  const data = await getAllSoundLib(0);
  console.log("11111", data);
  if (data !== undefined) {
    preAudio.value = await getAllSoundLib(0);
    userAudio.value = await getAllSoundLib(1);
    audioList.value = await getAllSoundLib(2);
    // 增加tagContent
    preAudio.forEach((audio) => {
      audio.tagContent = "预设";
    });

    userAudio.forEach((audio) => {
      audio.tagContent = "自定义";
    });

    // 合并所有音频数据
    audioList.value = [...preAudio, ...userAudio, ...allAudio];
  }
});

async function fetchSoundLibList() {
  const res = await getSoundLibList(); //获取用户训练声音
  console.log(res);
}

const getAllSoundLib = async (type) => {
  const data = getSoundLib(type);
  if (data !== null) {
    audioList.value = data;
  }
};

function playAudio(audio) {
  audio.isPlaying = !audio.isPlaying;
}

function downloadAudio(audio) {
  // Implement download logic here
}

function toggleFavorite(audio) {
  if (userInfo) {
    audio.isFavorite = !audio.isFavorite;
  } else {
    ElMessage.error("请先登录");
  }
}

const filteredAudioList = computed(() => {
  if (audioList !== null) {
    return audioList.value.filter((audio) => {
      const isFavorite =
        activeSubTab.value === "favorites" ? audio.isFavorite : true;

      switch (activeSubTab.value) {
        case "all":
          return true;
        case "preset":
          return audio.tagContent === "预设" && isFavorite;
        case "custom":
          return audio.tagContent === "自定义" && isFavorite;
        case "favorites":
          return audio.isFavorite;
        default:
          return true;
      }
    });
  }
});

// test
// 获取音频元素
const audio = document.getElementById("myAudio");

// 播放音频
function playAudio2() {
  audio.play();
}

// 暂停音频
function pauseAudio() {
  audio.pause();
}

// 设置音频音量
function setVolume(volume) {
  audio.volume = volume;
}
</script>

<style scoped>
.voice-library {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: white;
  margin: 0 150px;
  margin-bottom: 30px;
  border-radius: 0 0 15px 15px;
}

.search-bar {
  width: 100%;
}

.tabs {
  width: 100%;
}

.audio-items {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 20px;
  justify-content: center;
  padding: 10px;
}

.audio-card {
  border: 1px solid #e4e7ed;
  padding: 15px;
  border-radius: 8px;
  width: 90%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: center;
  color: #24a3ff;
}
.audio-items .audio-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.audio-items .el-icon {
  margin-right: 5px;
}
</style>
