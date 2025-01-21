<template>
  <div class="voice-library">
    <!-- 搜索框 -->
    <div class="search-bar">
      <el-input
        placeholder="搜索音频库"
        prefix-icon="el-icon-search"
        v-model="searchQuery"
        @input="getAllSoundLib"
        ><template #prepend> <el-button :icon="Search" /> </template
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
          <h3>{{ audio.soundName }}</h3>
          <el-tag color="#79b2ff" effect="dark">
            <component :is="audio.tag" />
            {{ audio.tagContent }}
          </el-tag>
        </div>
        <p>{{ audio.description }}</p>
        <el-slider
          v-model="audio.speed"
          max="2"
          min="0.5"
          step="0.1"
          @change="updatePlaybackRate"
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
          <el-button @click="audio.soundUrl">
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
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[3, 6, 9, 12]"
      :total="totalAudioCount"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import {
  Star,
  VideoPlay,
  Download,
  VideoPause,
  StarFilled,
  Search,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getSoundLibList } from "@/api/voice";
import { getSoundLib } from "@/api/voice";

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const activeSubTab = ref("all");
const searchQuery = ref("");
const audioList = ref([]);

onMounted(async () => {
  const preAudio = await getAllSoundLib(0); // 查询系统预设声音
  console.log(preAudio);
  const userAudio = await getAllSoundLib(1); // 查询用户自训练声音
  const allAudio = await getAllSoundLib(2); // 查询所有音频

  audioList.value = [...allAudio];
  console.log(audioList.value);
});
const typeMapping = {
  0: "预设",
  1: "自定义",
};
const getAllSoundLib = async (type) => {
  const form = {
    type: type,
    current: currentPage.value,
    size: pageSize.value,
    userId: userInfo ? userInfo.id : 0,
    status: 2,
    soundName: searchQuery.value || "",
  };
  try {
    const response = await getSoundLib(form);
    if (response.code === "0") {
      const records = response.data.records;
      totalAudioCount.value = response.data.total;
      records.forEach((audio) => {
        audio.isPlaying = false;
        audio.speed = 1;
      });
      audioList.value = records.map((audio) => ({
        ...audio,
        tagContent: typeMapping[audio.type],
      }));

      return records;
    } else {
      ElMessage.error(response.message);
      return [];
    }
  } catch (error) {
    console.error("获取音频库失败:", error);
    return [];
  }
};
let audioElement = null;

const playAudio = (audio) => {
  if (!audioElement) {
    audioElement = new Audio(audio.value.soundUrl);
    audioElement.playbackRate = audio.value.speed;

    console.log(audio.value);
    if (audio.value.isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }

    audio.value.isPlaying = !audio.value.isPlaying;
  }
};

const updatePlaybackRate = () => {
  if (audioElement) {
    audioElement.playbackRate = audio.value.speed;
  }
};

onBeforeUnmount(() => {
  if (audioElement) {
    audioElement.pause();
    audioElement = null;
  }
});

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

const currentPage = ref(1);
const pageSize = ref(3);
const totalAudioCount = ref(0);

async function fetchAllAudio() {
  await getAllSoundLib(0);
  await getAllSoundLib(1);
  const allAudio = await getAllSoundLib(2);
  audioList.value = [...allAudio];
}

function handleCurrentChange(newPage) {
  currentPage.value = newPage;
  fetchAllAudio();
}
watch(currentPage, () => {
  fetchAllAudio();
});
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
