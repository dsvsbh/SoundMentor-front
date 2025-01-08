<template>
  <div class="voice-training">
    <h2>训练AI声音</h2>
    <p>通过上传或录制声音样本，训练属于你的个性化AI声音</p>
    <div class="upload-section">
      <el-upload
        class="upload-demo"
        drag
        action=""
        :on-change="handleUpload"
        :before-upload="beforeUpload"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">点击或拖拽文件到这里上传</div>
        <div class="el-upload__tip">支持格式：.mp3, .ogg, .wav</div>
      </el-upload>

      <div class="training-list">
        <div v-for="file in uploadedFiles" :key="file.name" class="file-item">
          <p>{{ file.name }}</p>
          <el-progress :percentage="file.progress"></el-progress>
          <el-button @click="removeFile(file)">删除</el-button>
        </div>
      </div>
    </div>
    <el-button type="primary" @click="startTraining">开始训练</el-button>
  </div>
</template>

<script>
export default {
  name: "VoiceTraining",
  data() {
    return {
      uploadedFiles: [],
    };
  },
  methods: {
    handleUpload(file) {
      // 处理上传文件的逻辑
    },
    beforeUpload(file) {
      // 验证上传文件格式
      return true; // 可自定义验证
    },
    removeFile(file) {
      // 删除文件的逻辑
    },
    startTraining() {
      // 开始训练的逻辑
    },
  },
};
</script>

<style scoped>
.voice-training {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  width: 70%;
  margin: 0 auto;
  margin-bottom: 30px;
  border-radius: 0 0 15px 15px;
}
</style>