<template>
  <div class="voice-training">
    <div class="upload-section">
      <el-upload
        v-model:file-list="uploadedFile"
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :limit="1"
      >
        <h3>上传音频文件</h3>
        <el-icon color="#24a3ff" size="50"><MessageBox /></el-icon>
        <div class="el-upload__text">点击或拖拽文件到这里上传</div>
        <div class="el-upload__tip">支持格式：.mp3, .ogg, .wav</div>
        <audio v-if="uploadedFile.length > 0" :src="uploadedFile[0].url" />
      </el-upload>
    </div>
    <div class="online-record">
      <h3>在线录制</h3>
      <el-icon color="#24a3ff" size="50"><Mic /></el-icon>
      <el-button type="primary" @click="startTraining">开始录制</el-button>
    </div>
  </div>
</template>  

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { uploadFileService } from "@/api/file";
import { Upload, MessageBox, Mic } from "@element-plus/icons-vue";
const uploadedFile = ref([]);

const handleExceed = (files, fileList) => {
  fileList.splice(0, fileList.length);
  const newFile = files[0];
};

const handleSuccess = async (file) => {
  const formData = new FormData();
  formData.append("file", file.raw);

  try {
    const response = await uploadFileService(formData);
    if (response.code == 0) {
      ElMessage.success("文件上传成功!");
      uploadedFile.value.push(response.data);
      console.log(uploadedFile.value);
    } else {
      ElMessage.error("文件上传失败!");
    }
  } catch (error) {
    console.error("Upload error:", error);
    ElMessage.error("文件上传出错!");
  }
};

const beforeUpload = (file) => {
  const fileType = file.type;
  if (fileType !== "audio/mpeg") {
    ElMessage.error("只支持音频文件格式: .mp3");
    return false;
  }
  return true;
};

const startTraining = () => {};
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
