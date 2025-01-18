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
          <el-button type="primary" @click="generatePPT"
            >一键生成讲解</el-button
          >
        </div>
      </div>
    </div>
    <div class="audio-controller"></div>
  </div>
  <Footer />
</template>

<script setup>
import { ref } from "vue";
import Footer from "@/components/Footer.vue";
import { uploadFileService } from "@/api/file";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const uploadedFiles = ref([]);

// 上传文件的方法
const handleFileUpload = async (file) => {
  try {
    const response = await uploadFileService(file);

    if (response.data && response.data.fileUrl) {
      uploadedFiles.value.push({
        name: file.name,
        url: response.data.fileUrl,
      });
    }
  } catch (error) {
    // 使用全局消息提醒
    ElMessage.error("文件上传失败，请重试！");
  }
  return false;
};

// 验证上传文件格式
const beforeUpload = (file) => {
  const isValid = ["ppt", "pptx"].includes(
    file.name.split(".").pop().toLowerCase()
  );
  if (!isValid) {
    ElMessage.error("只能上传特定格式的文件！");
  }
  return isValid;
};

// 功能示例
const generateAudio = () => {
  console.log("generateAudio");
};

const generatePPT = () => {
  console.log("generatePPT");
};
</script>  

<style scoped>
.ppt-container {
  background-color: #f5f7fa;
  height: 1000px;
  padding: 0 150px;
}
.header {
  display: flex;
  height: 100%;
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
  height: 100%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.upload-ppt {
  padding: 60px;
}
.upload-demo {
  padding: 20px;
}
</style>
