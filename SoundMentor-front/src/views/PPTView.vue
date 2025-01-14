<template>
  <div class="ppt-container">
    <div class="header">
      <div class="ppt-preview-left">
        <div class="title">PPT预览</div>
        <div class="upload-ppt">
          <el-upload
            v-model:file-list="uploadedFiles"
            class="upload-demo"
            drag
            :before-upload="handleFileUpload"
          >
            <div style="height: 200px">
              <el-icon color="#24a3ff" size="50"><upload-filled /></el-icon>
              <div class="el-upload__text">点击或拖拽文件到这里上传</div>
              <div class="el-upload__tip">支持格式：.ppt, .pptx</div>
            </div>
          </el-upload>
          <div class="button-group">
            <el-button type="default" @click="generateAudio"
              >生成音频</el-button
            >
            <el-button type="primary" @click="generatePPT"
              >一键生成讲解</el-button
            >
          </div>
        </div>
      </div>
      <div class="intel-chat-right">
        <div class="title">智能对话</div>
      </div>
    </div>
    <div class="audio-controller"></div>
  </div>
  <Footer />
</template>

<script>
import { ref } from "vue";
import Footer from "@/components/Footer.vue";
import { uploadFileService } from "@/api/file";
import { UploadFilled } from "@element-plus/icons-vue";
export default {
  name: "PPTView",
  components: {
    UploadFilled,
    Footer,
  },
  setup() {
    const uploadedFiles = ref([]);
    return {
      uploadedFiles,
    };
  },
  methods: {
    async handleFileUpload(file) {
      try {
        const response = await uploadFileService(file);
        if (response.data && response.data.fileUrl) {
          this.uploadedFiles.push({
            name: file.name,
            url: response.data.fileUrl,
          });
        }
      } catch (error) {
        this.$message.error("文件上传失败，请重试！");
      }
      return false;
    },
    generateAudio() {
      console.log("generateAudio");
    },
    generatePPT() {
      console.log("generatePPT");
    },
  },
};
</script>

<style scoped>
.ppt-container {
  background-color: #f5f7fa;
  height: 1000px;
  padding: 0 100px;
}
.header {
  display: flex;
  height: 300px;
  padding-top: 30px;
}
.title {
  font-size: 20px;
  font-weight: bold;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}
.ppt-preview-left {
  flex: 1.5;
  background-color: #fff;
  border-radius: 10px;
  height: 510px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.upload-demo {
  padding: 20px;
}
.intel-chat-right {
  flex: 1;
  background-color: #fff;
  border-radius: 10px;
  height: 510px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  margin-left: 20px;
}
</style>
