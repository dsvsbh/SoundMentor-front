<template>
  <div class="ppt-container">
    <div class="ppt-box">
      <div class="title">有声PPT制作</div>
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
        <el-button
          type="primary"
          @click="generateExplain"
          :disabled="!isUploadPPT"
          >一键生成讲解</el-button
        >
      </div>
    </div>
  </div>

  <el-backtop :right="100" :bottom="100" />
  <Footer />
</template>
<script setup>
import { ref } from "vue";
import { uploadFileService } from "@/api/file";
import { getPptTask, taskExecutionService } from "@/api/task";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
import Footer from "@/components/headFoot/Footer.vue";

const uploadedFiles = ref([]);
const isUploadPPT = ref(false);

const handleFileUpload = async (file) => {
  const isPptFile = file.name.endsWith(".ppt") || file.name.endsWith(".pptx");

  if (!isPptFile) {
    ElMessage.error("请上传有效的PPT或PPTX文件！");
    return false;
  }

  try {
    const response = await uploadFileService(file);

    if (response.data && response.data.fileUrl) {
      uploadedFiles.value = [
        {
          name: file.name,
          pptUrl: response.data.fileUrl,
        },
      ];
      ElMessage.success("文件上传成功！");
      console.log(uploadedFiles.value[0]);
      isUploadPPT.value = true;
    }
  } catch (error) {
    ElMessage.error("文件上传失败，请重试！");
  }
};
const routeToEdit = async (taskId) => {
  router.push({
    path: "/pptEdit",
    query: {
      taskId: taskId,
      firstPageRes: pptTaskRes.value[0],
    },
  });
};

const pptTaskRes = ref([]);
const generateExplain = async () => {
  const pptUrls = uploadedFiles.value.map((file) => file.pptUrl);

  if (pptUrls.length === 0) {
    ElMessage.error("请先上传PPT文件！");
    return;
  }

  const form = {
    type: "PPT_SUMMARY",
    taskType: "PPT_SUMMARY",
    pptUrl: pptUrls[0],
  };

  try {
    ElMessage({ message: "生成中...", type: "info" });

    // 启动任务
    const taskResponse = await taskExecutionService(form);
    const taskId = taskResponse.data; // 任务 ID

    // 获取第一页结果
    const firstPageRes = await getPptTask(taskId);
    pptTaskRes.value = firstPageRes;

    // 跳转到编辑页面
    routeToEdit(taskId);
  } catch (error) {
    console.error("请求失败:", error);
    ElMessage({ message: "生成失败，请重试。", type: "error" });
  }
};
</script>
<style scoped>
.ppt-container {
  background-color: #f5f7fa;
  height: 100%;
  margin-bottom: 30px;
  margin: 0 auto;
  width: 1175px;
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
</style>