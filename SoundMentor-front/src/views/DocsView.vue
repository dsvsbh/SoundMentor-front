<template>
  <div class="docs-container">
    <div class="voice-library">
      <div class="search-bar">
        <el-input
          placeholder="搜索音频库"
          prefix-icon="el-icon-search"
          v-model="searchQuery"
        ></el-input>
      </div>

      <el-tabs v-model="activeTab" class="tabs">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="预设" name="preset"></el-tab-pane>
        <el-tab-pane label="自定义" name="custom"></el-tab-pane>
        <el-tab-pane label="收藏" name="favorites"></el-tab-pane>
      </el-tabs>

      <div class="audio-items">
        <div
          class="audio-card"
          v-for="(audio, index) in audioList"
          :key="index"
        >
          <h3>{{ audio.title }}</h3>
          <p>{{ audio.description }}</p>
          <el-rate v-model="audio.rating" disabled></el-rate>
          <el-slider
            v-model="audio.speed"
            max="2"
            min="0.5"
            step="0.1"
          ></el-slider>
          <el-select v-model="audio.emotion" placeholder="情感">
            <el-option label="愉快" value="happy"></el-option>
            <el-option label="生气" value="angry"></el-option>
            <el-option label="悲伤" value="sad"></el-option>
            <el-option label="中立" value="neutral"></el-option>
          </el-select>
          <div class="action-buttons">
            <el-button @click="playAudio(audio)">试听</el-button>
            <el-button @click="downloadAudio(audio)">下载</el-button>
            <el-button @click="toggleFavorite(audio)">
              {{ audio.isFavorite ? "取消收藏" : "收藏" }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>  

<script>
import Footer from "../components/Footer.vue";

export default {
  name: "DocsView",
  components: {
    Footer,
  },
  data() {
    return {
      searchQuery: "",
      activeTab: "all",
      audioList: [
        {
          title: "海韵自然的男声",
          description: "适合各类学习场景",
          rating: 4.9,
          speed: 1.0,
          emotion: "neutral",
          isFavorite: false,
        },
        {
          title: "温柔女声",
          description: "适合儿童教育",
          rating: 4.8,
          speed: 1.0,
          emotion: "happy",
          isFavorite: false,
        },
        {
          title: "专业播音腔",
          description: "适合正式场合",
          rating: 4.7,
          speed: 1.0,
          emotion: "neutral",
          isFavorite: false,
        },
        {
          title: "活力青年音",
          description: "适合互动教学",
          rating: 4.6,
          speed: 1.0,
          emotion: "happy",
          isFavorite: false,
        },
        {
          title: "沉稳中年音",
          description: "适合知识讲解",
          rating: 4.5,
          speed: 1.0,
          emotion: "neutral",
          isFavorite: false,
        },
        {
          title: "情感朗读音",
          description: "适合文学作品",
          rating: 4.8,
          speed: 1.0,
          emotion: "neutral",
          isFavorite: false,
        },
      ],
    };
  },
  methods: {
    playAudio(audio) {
      // 播放音频的逻辑
      console.log("Playing:", audio);
    },
    downloadAudio(audio) {
      // 下载音频的逻辑
      console.log("Downloading:", audio);
    },
    toggleFavorite(audio) {
      audio.isFavorite = !audio.isFavorite;
    },
  },
};
</script>  

<style scoped>
.docs-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.voice-library {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: white;
  width: 70%;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 30px;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-bar {
  width: 80%;
  max-width: 800px;
}

.tabs {
  width: 80%;
  max-width: 800px;
}

.audio-items {
  width: 80%;
  max-width: 800px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  justify-content: center;
  padding: 10px;
}

.audio-card {
  border: 1px solid #e4e7ed;
  padding: 15px;
  border-radius: 8px;
  width: 100%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>