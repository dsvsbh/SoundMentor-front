<template>
  <div class="voice-library">
    <!-- 搜索框 -->
    <div class="search-bar">
      <!-- TODO -->
      <el-input
        placeholder="搜索音频库"
        prefix-icon="el-icon-search"
        v-model="searchQuery"
        @keyup.enter="fetchAudioLibrary"
      >
        <template #prepend>
          <el-button :icon="Search" />
        </template>
      </el-input>
    </div>

    <!-- 标签页 -->
    <el-tabs v-model="activeSubTab" class="tabs">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      />
    </el-tabs>

    <!-- 音频列表 -->

    <div class="audio-items">
      <div class="audio-card" v-for="audio in audioList" :key="audio.id">
        <div class="audio-card-header">
          <h3>{{ audio.soundName }}</h3>
          <el-tag color="#79b2ff" effect="dark">
            <component :is="audio.type" />
            {{ audio.type === 1 ? "预设" : audio.type === 0 ? "自定义" : "" }}
          </el-tag>
        </div>
        <p v-if="audio.description !== '内容为空'">
          {{ audio.description }}
        </p>
        <el-skeleton style="width: 240px" v-else>
          <template #template>
            <el-skeleton-item
              variant="text"
              style="
                margin-right: 16px;
                width: 300px;
                height: 18px;
                margin-top: 20px;
              "
            />
            <el-skeleton-item
              variant="text"
              style="width: 30%; height: 18px; margin-bottom: 10px"
            />
          </template>
        </el-skeleton>
        <!-- TODO调整速度 -->
        <el-slider
          v-model="audio.speed"
          max="2"
          min="0.5"
          step="0.1"
          @change="updatePlaybackRate"
        ></el-slider>
        <div class="action-buttons">
          <el-button @click="playAudio(audio)" v-if="!audio.isPlaying">
            <el-icon color="#24a3ff">
              <VideoPlay />
            </el-icon>
            试听
          </el-button>
          <el-button @click="pauseAudio(audio)" v-else>
            <el-icon color="#24a3ff">
              <VideoPause />
            </el-icon>
            暂停
          </el-button>
          <el-button @click="downloadAudio(audio.soundUrl)">
            <el-icon color="#24a3ff"><Download /></el-icon>
            下载
          </el-button>
          <el-button @click="addnewFavorite(audio)" v-if="!audio.isFavorite">
            <el-icon color="#24a3ff">
              <Star />
            </el-icon>
            收藏
          </el-button>
          <el-button @click="delFavorite(audio)" v-else>
            <el-icon color="#24a3ff">
              <StarFilled />
            </el-icon>
            取消收藏
          </el-button>
        </div>
      </div>
    </div>

    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[3, 6, 9, 12]"
      :total="totalAudioCount"
      layout="total, sizes,prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handlePageSizeChange"
    ></el-pagination>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  Star,
  VideoPlay,
  Download,
  VideoPause,
  StarFilled,
  Search,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import {
  getSoundLib,
  getFavorite,
  addFavorite,
  deleteFavorite,
} from "@/api/voice";

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const searchQuery = ref("");
const activeSubTab = ref("all");
const currentPage = ref(1);
const pageSize = ref(6);
const totalAudioCount = ref(0);
const audioList = ref([]);
const userId = userInfo.id;

const tabs = ref([
  { label: "全部", name: "all", type: 2 },
  { label: "预设", name: "preset", type: 1 },
  { label: "自定义", name: "custom", type: 0 },
  { label: "收藏", name: "favorites", type: 3 },
]);
// 文件名格式化函数
const formatFileName = (fileName, maxLength) => {
  if (!fileName) return "内容为空";

  // 如果文件名大于 maxLength，则截断并添加 '...'
  if (fileName.length > maxLength) {
    return `${fileName.slice(0, maxLength)}...`;
  }

  // 如果文件名不足 maxLength，则填充到 maxLength 的占位符（用空格填充）
  return fileName.padEnd(maxLength, " ");
};
const fetchAudioLibrary = async () => {
  const type = tabs.value.find((tab) => tab.name === activeSubTab.value).type;
  const data = {
    type,
    current: currentPage.value,
    size: pageSize.value,
    userId: type === 3 ? undefined : userId,
    soundName: searchQuery.value || undefined,
  };

  try {
    const response =
      type === 3 ? await getFavorite(data) : await getSoundLib(data);
    audioList.value = response.data.records.map((audio) => ({
      ...audio,
      soundName: formatFileName(audio.soundName, 10),
      description: formatFileName(audio.description, 30),
      isPlaying: false,
    }));
    totalAudioCount.value = response.data.total;
  } catch (error) {
    console.error("Error fetching audio library:", error);
  }
};

watch([activeSubTab, searchQuery, currentPage], fetchAudioLibrary, {
  immediate: true,
});
const handleCurrentChange = (page) => {
  currentPage.value = page;
};
// 处理页面大小变化
const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 重置到第一页
  fetchAudioLibrary();
};

// 创建音频元素
const audioElement = ref(new Audio());

// 播放音频的函数
const playAudio = (audio) => {
  console.log(audio.soundUrl);
  if (audioElement.value.src && audioElement.value.src !== audio.soundUrl) {
    audioElement.value.pause();
    audioElement.value.currentTime = 0;
  }

  audioElement.value.src = audio.soundUrl;
  audioElement.value.play();
  audio.isPlaying = true;
};

// 暂停音频的函数
const pauseAudio = (audio) => {
  audioElement.value.pause();
  audio.isPlaying = false;
};

// 下载
const downloadAudio = (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
// 添加收藏
const addnewFavorite = async (audio) => {
  try {
    const res = await addFavorite(audio.id);
    if (res.data == true) {
      console.log(res.data);
      ElMessage.success("添加收藏成功");
      fetchAudioLibrary();
    } else {
      console.log(res.data);
      ElMessage.error("添加失败：", res.code);
    }
  } catch (err) {
    ElMessage.error(err.message);
  }
};
// 取消收藏
const delFavorite = async (audio) => {
  try {
    const res = await deleteFavorite(audio.id);
    if (res.data == true) {
      console.log(res.data);
      ElMessage.success("取消收藏成功");
      fetchAudioLibrary();
    } else {
      console.log(res.data);
      ElMessage.error("取消失败：", res.message);
    }
  } catch (err) {
    ElMessage.error(err.message);
  }
};
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
  margin: 0 140px;
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 20px;
  justify-content: center;
  padding: 10px;
}

.audio-card {
  max-width: 100%;
  width: auto;
  border: 1px solid #e4e7ed;
  padding: 15px;
  border-radius: 8px;
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
