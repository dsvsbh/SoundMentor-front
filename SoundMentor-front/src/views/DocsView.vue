<template>
  <div class="docs-container">
    <el-menu class="menu" mode="horizontal" :default-active="activeTab">
      <el-menu-item index="voice-library" @click="activeTab = 'voice-library'">
        声音样本库
      </el-menu-item>
      <el-menu-item
        index="voice-training"
        @click="activeTab = 'voice-training'"
      >
        声音训练
      </el-menu-item>
    </el-menu>
    <!-- 声音样本库 -->
    <div v-if="activeTab === 'voice-library'">
      <VoiceLibrary />
    </div>

    <!-- 声音训练 -->
    <div v-if="activeTab === 'voice-training'">
      <VoiceTraining />
    </div>
    <Footer />
  </div>
</template>  

<script>
import Footer from "../components/Footer.vue";
import VoiceLibrary from "../components/VoiceLibrary.vue";
import VoiceTraining from "../components/VoiceTraining.vue";

export default {
  name: "DocsView",
  components: {
    Footer,
    VoiceLibrary,
    VoiceTraining,
  },
  data() {
    return {
      activeTab: "voice-library",
    };
  },
  methods: {},
};
</script>  

<style scoped>
.docs-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 30px 15px;
  background-color: #f5f7fa;
}
.menu {
  margin-top: 30px;
  background-color: white;
  margin: 0 150px;
  border-radius: 15px 15px 0 0;
  padding: 0 20px;
}
</style>