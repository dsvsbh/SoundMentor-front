<template>
  <div class="voice-training">
    <div class="upload-section">
      <!-- 左 -->
      <el-upload
        v-model:file-list="uploadedFiles"
        class="upload-demo"
        drag
        action=""
        :on-change="handleUpload"
        :before-upload="beforeUpload"
      >
        <h3>上传音频文件</h3>
        <el-icon color="#24a3ff" size="50"><MessageBox /></el-icon>
        <div class="el-upload__text">点击或拖拽文件到这里上传</div>
        <div class="el-upload__tip">支持格式：.mp3, .ogg, .wav</div>
      </el-upload>
    </div>
    <!-- 右 -->
    <div class="online-record">
      <h3>在线录制</h3>
      <el-icon color="#24a3ff" size="50"><Mic /></el-icon>

      <el-button type="primary" @click="startTraining">开始录制</el-button>
    </div>
    <!-- <div class="training-list">
      <div v-for="file in uploadedFiles" :key="file.name" class="file-item">
        <p>{{ file.name }}</p>
        <el-progress :percentage="file.progress"></el-progress>
        <el-button @click="removeFile(file)">删除</el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
import { Upload, MessageBox, Mic } from "@element-plus/icons-vue";
export default {
  name: "VoiceTraining",
  components: {
    Upload,
    MessageBox,
    Mic,
  },
  data() {
    return {
      uploadedFiles: [],
    };
  },
  methods: {
    handleUpload(file) {},
    beforeUpload(file) {
      return true;
    },
    removeFile(file) {},
    startTraining() {},
  },
};
</script>

<style scoped>
.voice-training {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  width: 80%;
  height: 400px;
  margin: 0 auto;
  margin-bottom: 30px;
  border-radius: 0 0 15px 15px;
}
.upload-demo {
  height: 100%;
}
.upload-section {
  flex: 1;
}
.online-record {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #dedede;
  height: 237px;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>
