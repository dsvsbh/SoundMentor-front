<template>
  <div class="ppt-container">
    <el-button @click="openHandler">预览</el-button>
    <div v-if="showViewer" class="ppt-viewer">
      <iframe
        sandbox="allow-scripts allow-top-navigation allow-same-origin allow-popups"
        :src="officeViewerUrl"
        frameborder="0"
        style="height: 560px; width: 100%; z-index: 1000"
      ></iframe>
      <iframe
        src="https://view.officeapps.live.com/op/embed.aspx?src=https://http://121.43.62.36:9000/ppt/1737455868219_e70bc8f716d0dfaf47ccecd0aa2990d8.pptx"
        width="800"
        height="600"
      ></iframe>

      <el-button @click="closeHandler">关闭预览</el-button>
    </div>
    <div class="ppt-box">
      <div class="title">
        {{ !isUploadPPT ? "有声PPT制作" : "编辑讲解文本" }}
      </div>
      <template v-if="isUploadPPT">
        <div class="edit-ppt">
          <div class="center">
            <div class="sider">
              <!-- TODO -->
              <div class="small">
                <img src="/src/assets/logo.png" alt="" />
                <div class="info">
                  <div>幻灯片</div>
                  <div>第1页</div>
                </div>
              </div>
            </div>
            <div class="main">
              <div class="ppt-page"></div>
              <textarea name="explain" id="" class="explain"></textarea>
              <div class="audio">
                <div class="left">
                  <!-- TODO -->
                  <text style="font-size: 20px; font-weight: 400">第一页</text>
                  <text style="font-size: 14px; color: #909399"
                    >时长：10s 声音：xxxx</text
                  >
                </div>
                <audio
                  id=""
                  src="http://121.43.62.36:9000/mp3/zh-CN-XiaomengNeural.mp3"
                ></audio>
                <div class="right">
                  <text>替换语音</text>
                  <text style="margin-left: 20px">下载</text>
                </div>
              </div>
            </div>
          </div>

          <!-- TODO -->
          <div class="btns">
            <el-button type="default" @click="backUpload">返回</el-button>
            <el-button type="primary" @click="generateAudio"
              >生成语音</el-button
            >
            <el-button type="primary" @click="generateExplain"
              >一键生成讲解</el-button
            >
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-ppt">
          <el-upload
            v-model:file-list="uploadedFile"
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
        </div>
      </template>
    </div>
  </div>

  <el-backtop :right="100" :bottom="100" />
  <Footer />
</template>

<script setup>
import { ref, computed } from "vue";
import Footer from "@/components/headFoot/Footer.vue";
import { uploadFileService } from "@/api/file";
import { getPptTask, taskExecutionService } from "@/api/task";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const uploadedFiles = ref([]);

const handleFileUpload = async (file) => {
  const isPptFile = file.name.endsWith(".ppt") || file.name.endsWith(".pptx");

  if (!isPptFile) {
    ElMessage.error("请上传有效的PPT或PPTX文件！");
    return false;
  }

  try {
    const response = await uploadFileService(file);

    if (response.data && response.data.fileUrl) {
      uploadedFiles.value.push({
        name: file.name,
        pptUrl: response.data.fileUrl,
      });
      ElMessage.success("文件上传成功！");
      isUploadPPT.value = true;
    }
  } catch (error) {
    ElMessage.error("文件上传失败，请重试！");
  }
};

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

    const { data: taskResponse } = await taskExecutionService(form);
    const taskId = taskResponse.data;

    const { data: resultResponse } = await getPptTask(taskId);

    console.log(resultResponse);
    ElMessage({ message: "生成成功！", type: "success" });
  } catch (error) {
    console.error("请求失败:", error);
    ElMessage({ message: "生成失败，请重试。", type: "error" });
  }
};

const isUploadPPT = ref(false);
// PPT 文件的公共 URL
const pptUrl =
  "http://121.43.62.36:9000/ppt/1737455868219_e70bc8f716d0dfaf47ccecd0aa2990d8.pptx";

// 控制预览显示的状态
const showViewer = ref(false);

// 计算属性，生成 Office Web Viewer 的 URL
const officeViewerUrl = computed(() => {
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
    pptUrl
  )}`;
});

// 打开预览
const openHandler = () => {
  showViewer.value = true;
};

// 关闭预览
const closeHandler = () => {
  showViewer.value = false; // 关闭预览时设置为 false
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

.edit-ppt {
  padding: 30px 30px;
  height: 580px;
}
.center {
  display: flex;
  gap: 20px;
}
.sider {
  height: 540px;
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 5px;
}
.small {
  display: flex;
  flex-direction: row;
  margin: 10px 8px;
  padding: 8px 10px;
  background-color: #fff;
  border: #e9e9e9;
  border-width: 1px;
  border-radius: 5px;
}
.small img {
  height: 40px;
  width: 40px;
}
.small .info {
  margin-left: 15px;
  font-size: 14px;
  gap: 5px;
}
.main {
  border-radius: 5px;
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
  flex: 0.7;
  border-radius: 5px;
}
.audio {
  flex: 0.3;
  display: flex;
  flex-direction: row;
  padding: 10px;
  background-color: #f2f2f2;
  border-radius: 5px;
}
.audio .left {
  flex: 4.5;
  display: flex;
  flex-direction: column;
}
.audio .right {
  flex: 1;
  padding-top: 10px;
  padding-left: 150px;
  color: #409eff;
  font-size: 14px;
}
.btns {
  float: right;
  margin-top: 20px;
}
</style>
