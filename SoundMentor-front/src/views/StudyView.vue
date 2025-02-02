<template>
  <div class="study-container">
    <el-menu class="menu" mode="horizontal" :default-active="activeTab">
      <el-menu-item index="phonic-learn" @click="activeTab = 'phonic-learn'">
        语音学习辅助
      </el-menu-item>
      <el-menu-item
        index="audio-commentary"
        @click="activeTab = 'audio-commentary'"
      >
        个性化语音讲解
      </el-menu-item>
    </el-menu>
    <div v-if="activeTab === 'phonic-learn'">
      <PhonicsLearningAids />
    </div>
    <div v-if="activeTab === 'audio-commentary'">
      <AudioCommentary />
    </div>
  </div>
  <Footer />
</template>

<script setup>
import PhonicsLearningAids from "@/components/study/PhonicsLearningAids.vue";
import AudioCommentary from "@/components/study/AudioCommentary.vue";
import Footer from "@/components/headFoot/Footer.vue";
import { ref } from "vue";

const activeTab = ref("phonic-learn");
</script>

<style scoped>
.study-container {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 30px auto;
  border-radius: 15px;
  padding: 0 20px;
  width: 1135px;
}
</style>