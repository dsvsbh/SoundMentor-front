<template>
  <div class="ppt-container">
    <div class="ppt-box">
      <div class="title">
        {{ !isUploadPPT ? "有声PPT制作" : "编辑讲解文本" }}
      </div>
      <template v-if="!isUploadPPT">
        <div class="edit-ppt">
          <div class="center">
            <div class="sider"></div>
            <div class="main">
              <div class="ppt-page"></div>
              <textarea name="explain" id="" class="explain"></textarea>
            </div>
          </div>
          <div class="btns">
            <el-button type="default">返回</el-button>
            <el-button type="primary">生成语音</el-button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-ppt">
          <el-upload
            v-model:file-list="uploadedFiles"
            class="upload-demo"
            drag
            :before-upload="handleFileUpload"
          >
            <div style="height: 100px">
              <el-icon color="#24a3ff" size="50"><upload-filled /></el-icon>
              <div class="el-upload__text">点击或拖拽文件到这里上传</div>
              <div class="el-upload__tip">支持格式：.ppt, .pptx</div>
            </div>
          </el-upload>
          <el-button type="primary" @click="generatePPT"
            >一键生成讲解</el-button
          >
        </div>
      </template>
    </div>
  </div>
  <div class="audio-controller">
    <div class="audio-box">
      <div class="title">音频管理</div>
      <template v-if="isUploadAudio"></template>
      <template v-else> </template>
    </div>
  </div>
  <el-backtop :right="100" :bottom="100" />
  <Footer />
</template>

<script setup>
import { ref } from "vue";
import Footer from "@/components/headFoot/Footer.vue";
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
      isUploadPPT.value = true;
    }
  } catch (error) {
    // 使用全局消息提醒
    ElMessage.error("文件上传失败，请重试！");
  }
  return false;
};

const generatePPT = () => {
  console.log("generatePPT");
};

const isUploadPPT = ref(false);
const isUploadAudio = ref(false);
</script>  

<style scoped>
.ppt-container {
  background-color: #f5f7fa;
  height: 100%;
  padding: 0 165px;
  margin-bottom: 30px;
}

.title {
  font-size: 20px;
  color: #5d5d5d;
  font-weight: bold;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}
.ppt-box {
  margin: 30px 0;
  background-color: #fff;
  border-radius: 10px;
  height: 100%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.upload-ppt {
  padding: 30px 60px;
}
.upload-demo {
  padding: 20px;
}

.edit-ppt {
  padding: 30px 30px;
  height: 480px;
}
.center {
  display: flex;
  gap: 20px;
}
.sider {
  height: 440px;
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 5px;
}
.main {
  border-radius: 5px;
  height: 440px;
  flex: 4;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.ppt-page {
  background-color: #eff8ff;
  flex: 3;
  border-radius: 5px;
}
.explain {
  flex: 1;
  border-radius: 5px;
}
.btns {
  float: right;
  margin-top: 20px;
}

.audio-controller {
  background-color: #f5f7fa;
  height: 100%;
  padding: 0 165px;
  margin-bottom: 30px;
}
.audio-box {
  margin: 30px 0;
  background-color: #fff;
  border-radius: 10px;
  height: 100px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
</style>
