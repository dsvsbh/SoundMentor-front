<template>
  <div class="ppt-container">
    <div class="ppt-box">
      <div class="title">
        <div>编辑讲解文本</div>
        <el-button type="primary" @click="download" :disabled="!isComplete"
          >下载有声PPT</el-button
        >
      </div>
      <div class="edit-ppt">
        <div class="center">
          <div class="sider">
            <div
              class="small"
              v-for="(pptPage, index) in uploadPPTfile"
              :key="index"
              @click="selectPage(index)"
            >
              <img :src="pptPage.imgUrl" alt="" />
              <div class="info">
                <div>幻灯片</div>
                <div>第{{ pptPage.pptPage + 1 }}页</div>
              </div>
            </div>
          </div>
          <div class="main">
            <div class="ppt-page" v-if="currentPage">
              <img :src="currentPage.imgUrl" alt="" />
            </div>
            <textarea
              class="explain"
              v-if="currentPage"
              v-model="currentPage.summary"
              @input="handleSummaryChange"
              placeholder="请在此输入幻灯片讲解文本"
            />

            <div class="audio" v-if="currentPage">
              <div class="left">
                <text style="font-size: 20px; font-weight: 400">
                  第{{ currentPage.pptPage + 1 }}页
                </text>
                <text style="font-size: 14px; color: #909399">
                  时长：10s 声音：xxxx
                </text>
              </div>
              <audio :src="currentPage.soundUrl" controls></audio>
              <el-select
                v-model="language"
                placeholder="请选择语言"
                style="width: 130px"
                :disabled="generating"
                @change="handleLanguageChange"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div class="right">
                <text style="cursor: pointer" @click="replaceAudio"
                  >替换语音</text
                >
                <text
                  style="margin-left: 20px; cursor: pointer"
                  @click="downloadAudio"
                  >下载</text
                >
              </div>
            </div>
          </div>
        </div>
        <div class="btns">
          <el-button type="default" @click="backUpload">返回</el-button>
          <el-button type="primary" @click="generateAudio">生成语音</el-button>
        </div>
      </div>
    </div>
  </div>
  <el-backtop :right="100" :bottom="100" />
  <Footer />
</template>
  
  <script setup>
import { onMounted, ref } from "vue";
import Footer from "@/components/headFoot/Footer.vue";
import {
  getPptTask,
  getPptResult,
  updatePPT,
  taskExecutionService,
} from "@/api/task";
import { uploadFileService } from "@/api/file";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import router from "@/router";


const route = useRoute();
const uploadPPTfile = ref([]);
const taskId = ref(null);
const currentPage = ref(null); // 初始为第一张幻灯片

const selectPage = (index) => {
  currentPage.value = uploadPPTfile.value[index];
  //console.log(currentPage.value.summary);
};
let isComplete = ref(false);
onMounted(() => {
  taskId.value = route.query.taskId;

  const firstPageRes = route.query.firstPageRes;
  if (firstPageRes) {
    try {
      currentPage.value = JSON.parse(decodeURIComponent(firstPageRes));
    } catch (error) {
      console.error("出错了:", error);
      currentPage.value = null;
    }
  }

  if (taskId.value && isComplete.value === false) {
    startPolling();
  }
  
  handleOption();
});
const startPolling = async () => {
  let lastLength = 0; // 上一次结果数组的长度
  let noChangeCount = 0;
  const maxNoChangeCount = 2; // 最大未变化次数5
  const intervalTime = 3000;

  const pollingInterval = setInterval(async () => {
    try {
      const res = await getPptTask(taskId.value); // 获取任务结果
      const currentLength = res.length; // 当前结果数组的长度

      // 如果结果数组长度没有变化
      if (currentLength === lastLength) {
        noChangeCount++;
      } else {
        noChangeCount = 0; // 重置未变化计数
        lastLength = currentLength; // 更新上一次结果数组的长度
      }

      // 更新结果数组
      uploadPPTfile.value = res;
      console.log(res);
      // 设置 currentPage 为第一张幻灯片
      if (uploadPPTfile.value.length > 0 && !currentPage.value) {
        currentPage.value = uploadPPTfile.value[0];
        console.log("Current Page updated:", currentPage.value);
      }
      // 如果结果数组长度在 60 秒内没有变化，停止轮询
      if (noChangeCount >= maxNoChangeCount) {
        clearInterval(pollingInterval);
        ElMessage({ message: "生成完成！", type: "success" });
        isComplete.value = true;
      }
    } catch (error) {
      console.error("轮询失败:", error);
      clearInterval(pollingInterval);
      ElMessage({ message: "生成失败，请重试。", type: "error" });
    }
  }, intervalTime);
};
const backUpload = async () => {
  router.back();
};

// 下载有声ppt
const download = async () => {
  try {
    const res = await getPptResult(taskId.value);
    console.log(res);
    window.open(res, "_blank");

    ElMessage.success("下载成功");
  } catch (err) {
    ElMessage.error(err.message);
  }
};
// 从本地存储加载音频库选项
const handleOption = () => {
  const audioListJson = localStorage.getItem("audioList");
  if (audioListJson) {
    const audioList = JSON.parse(audioListJson);
    audioList.forEach((item) => {
      options.push({
        value: item.id,
        label: item.soundName,
      });
    });
  }
};
const options = []; // 语言选择列表
const language = ref(""); // 当前选择的语言
const isSelect = ref(false); // 是否选择了音频库
// 处理语言选择
const handleLanguageChange = (value) => {
  language.value = value;
  isSelect.value = true;
};
// 生成语音
const generateAudio = async () => {
  try {
    const form = {
      type: "PPT_SUMMARY_VOICE",
      taskType: "PPT_SUMMARY_VOICE",
      userPptId: taskId.value,
      userSoundId: language.value,
      rate: 100,
    };
    const res = await taskExecutionService(form);
    ElMessage.info("语音生成请求已提交，请稍候");

    // 重新开始轮询以获取更新的结果
    isComplete.value = false;
    startPolling();
  } catch (error) {
    console.error("生成语音失败:", error);
    ElMessage.error("生成语音失败，请重试");
  }
};
// 监听文本框内容变化
const handleSummaryChange = async () => {
  if (currentPage.value) {
    const index = uploadPPTfile.value.findIndex(
      (page) => page.pptPage === currentPage.value.pptPage
    );
    if (index !== -1) {
      uploadPPTfile.value[index].summary = currentPage.value.summary;
      
      // 保存到服务器
      try {
        await updatePPT(uploadPPTfile.value);
      } catch (error) {
        console.error("保存讲解内容失败:", error);
      }
    }
  }
};
// 替换当前幻灯片的音频
const replaceAudio = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "audio/mp3";

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.includes("audio/mp3") && !file.type.includes("audio/mpeg")) {
      ElMessage.error("请上传MP3格式的音频文件");
      return;
    }

    try {
      ElMessage.info("正在上传音频，请稍候...");

      // 使用全局上传文件接口
      const response = await uploadFileService(file);

      if (!response || !response.data || !response.data.fileUrl) {
        throw new Error("上传失败或返回格式不正确");
      }

      // 更新当前页面的音频URL
      currentPage.value.soundUrl = response.data.fileUrl;

      // 更新uploadPPTfile数组中的页面
      const index = uploadPPTfile.value.findIndex(
        (page) => page.pptPage === currentPage.value.pptPage
      );
      if (index !== -1) {
        uploadPPTfile.value[index] = { ...currentPage.value };
      }
      await updatePPT(uploadPPTfile.value);
      ElMessage.success("音频替换成功");
    } catch (error) {
      console.error("音频上传失败:", error);
      ElMessage.error("音频上传失败，请重试");
    }
  };

  input.click();
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.ppt-box {
  margin: 30px 0;
  background-color: #fff;
  border-radius: 10px;
  height: 100%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
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
  background-color: #ededed81;
  border-radius: 5px;
  overflow-y: auto;
}
.small {
  display: flex;
  flex-direction: row;
  margin: 10px 8px;
  padding: 8px 10px;
  background-color: #fff;
  border: 1px solid #e9e9e9;
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
  border-radius: 5px;
  height: 350px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ppt-page img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.explain {
  flex: 0.7;
  border-radius: 5px;
  resize: none;
  border: 1px solid #d9d9d9;
}
.explain :focus {
  border: 1px solid #d9d9d9;
}
.audio {
  flex: 0.3;
  display: flex;
  flex-direction: row;
  padding: 10px;
  background-color: #f2f2f2;
  border-radius: 5px;
  align-items: center;
}
.audio .left {
  flex: 4.5;
  display: flex;
  flex-direction: column;
}
.audio .right {
  flex: 1;
  padding-top: 10px;
  padding-left: 100px;
  color: #409eff;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.btns {
  float: right;
  margin-top: 20px;
}
</style>