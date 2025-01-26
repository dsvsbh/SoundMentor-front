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
      <el-menu-item
        index="sound-trained-list"
        @click="activeTab = 'sound-trained-list'"
      >
        声音训练记录
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
    <!-- 声音训练记录 -->
    <div v-if="activeTab === 'sound-trained-list'">
      <VoiceRecords />
    </div>
    <Footer />
  </div>
</template>  

<script setup>
import Footer from "../components/headFoot/Footer.vue";
import VoiceLibrary from "../components/voice/VoiceLibrary.vue";
import VoiceTraining from "../components/voice/VoiceTraining.vue";
import VoiceRecords from "@/components/voice/VoiceRecords.vue";
import { ref } from "vue";

const activeTab = ref("voice-library");
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