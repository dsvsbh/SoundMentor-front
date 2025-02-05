<template>
  <div class="ppt-container">
    <div class="ppt-box">
      <div class="title">编辑讲解文本</div>
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
              name="explain"
              class="explain"
              v-model="summaryValue"
            ></textarea>
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
          <el-button type="primary" @click="generateAudio">生成语音</el-button>
        </div>
      </div>
    </div>
  </div>
  <el-backtop :right="100" :bottom="100" />
  <Footer />
</template>
  
  <script setup>
import { onMounted, ref, computed } from "vue";
import Footer from "@/components/headFoot/Footer.vue";
import { getPptTask } from "@/api/task";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import router from "@/router";

const route = useRoute();
const uploadPPTfile = ref([]);
const taskId = ref(null);
const currentPage = ref(null); // 初始为第一张幻灯片
const summaryValue = computed(() => {
  return currentPage ? currentPage.summary : "";
});
const selectPage = (index) => {
  currentPage.value = uploadPPTfile.value[index];
};
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
});
let isComplete = ref(false);
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
  router.back({
    path: "/ppt",
  });
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
  overflow-y: auto;
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
  