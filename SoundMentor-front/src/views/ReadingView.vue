<template>
  <!-- 音频设置 -->
  <div class="up-box">
    <div class="left-box">
      <div class="head">
        <text style="font-size: 22px; font-weight: bold; color: #5d5d5d"
          >文本朗读</text
        >
        <el-button
          type="primary"
          :disabled="text.length === 0 || generating || !isSelect"
          @click="audioPreview"
          >音频试听</el-button
        >
      </div>
      <el-divider />
      <el-input
        placeholder="请输入或粘贴教学内容（1-2000字）"
        v-model="text"
        type="textarea"
        :autosize="{ minRows: 16, maxRows: 16 }"
        style="width: 93%; margin: 0 25px"
        resize="none"
        :disabled="generating"
      />
      <div
        class="words"
        style="color: #cccccc; font-size: 14px; margin: 15px 25px"
      >
        当前字数：{{ text.length }} / 2000
      </div>
    </div>
    <div class="right-box">
      <div class="title">
        <el-icon size="20"><Operation /></el-icon>
        <div style="font-size: 18px">基础设置</div>
      </div>
      <p style="color: #606266">语言选择</p>
      <el-select
        v-model="language"
        placeholder="请选择语言"
        style="width: 200px"
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
      <p style="color: #606266">语速调节</p>
      <el-slider
        :max="2"
        :min="0.5"
        :step="0.1"
        v-model="speed"
        :disabled="generating"
      ></el-slider>
      <el-divider />
      <div class="title">
        <el-icon size="20"><Headset /></el-icon>
        <div style="font-size: 18px">音频设置</div>
      </div>
      <div class="audio-control">
        <el-button-group class="btns">
          <el-button @click="audioControl(-15)">-15s</el-button>
          <el-button
            @click="playAudio"
            :disabled="!audioUrl"
            :icon="VideoPlay"
            v-if="!isPlaying"
            >试听</el-button
          >
          <el-button @click="pauseAudio" v-else>
            <el-icon color="#24a3ff">
              <VideoPause />
            </el-icon>
            暂停
          </el-button>
          <el-button @click="audioControl(15)">+15s</el-button>
        </el-button-group>
        <el-slider
          :max="100"
          :min="0"
          :step="1"
          v-model="audioProgress"
          style="width: 60px"
          :disabled="!audioUrl"
        ></el-slider>
      </div>
      <el-button
        type="primary"
        style="width: 100%"
        :disabled="text.length === 0 || generating"
        @click="generateAudio"
        >生成语音</el-button
      >
    </div>
  </div>
  <!-- 生成记录 -->
  <div class="down-box">
    <div
      class="head"
      style="border-bottom: 1.5px solid #dcdfe6; padding-bottom: 20px"
    >
      <text style="font-size: 22px; font-weight: bold; color: #5d5d5d"
        >生成记录</text
      >
      <el-button type="primary">批量下载</el-button>
    </div>
    <div class="list">
      <template v-if="audioList.length > 0">
        <div class="item" v-for="(item, index) in paginatedItems" :key="index">
          <div class="left-info">
            <el-checkbox v-model="item.checked" size="large" />
            <div class="ico">
              <el-icon size="30" color="#ffffff"><Document /></el-icon>
            </div>
            <div class="info">
              <span style="font-size: 18px; font-weight: bold">{{
                item.name
              }}</span>
              <div style="display: flex; gap: 10px; color: #c0c4cc">
                <span>{{ item.date }}</span>
                <span>{{ item.format }}</span>
                <span>{{ item.duration }}</span>
              </div>
            </div>
          </div>
          <div class="right-btn">
            <audio :src="item.audioSrc" controls></audio>
            <div style="display: flex; gap: 30px">
              <el-link type="primary" href="" :underline="false">
                <el-icon><Download /></el-icon>下载
              </el-link>
              <el-link
                type="primary"
                href="javascript:void(0)"
                :underline="false"
                @click="handleDelete"
              >
                <el-icon><Delete /></el-icon>删除
              </el-link>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <el-empty description="暂无生成记录"></el-empty>
      </template>
    </div>

    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalItems"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </div>

  <Footer />
</template>
<script setup>
import Footer from "@/components/headFoot/Footer.vue";
import {
  Operation,
  Headset,
  VideoPlay,
  VideoPause,
} from "@element-plus/icons-vue";
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { taskExecutionService, getTaskDetailById } from "@/api/task";
import { fetchAllAudioLibraries } from "@/utils/VoiceList";
import { getNormalTtsRecord, delTtsRecord } from "@/api/read";
import { ElMessageBox } from "element-plus";

const text = ref(""); // 用户输入文本
const options = []; // 语言选择列表
const language = ref(""); // 当前选择的语言
const speed = ref(1); // 语速
const audioProgress = ref(0); // 音频进度
const audioUrl = ref(null); // 音频的URL
const audioElement = ref(new Audio()); // 音频播放元素
const generating = ref(false); // 是否正在生成音频
const taskId = ref(null); // 当前任务的ID
const isSelect = ref(false); // 是否选择了音频库

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

const isPlaying = ref(false);
// 播放音频
const playAudio = () => {
  if (audioUrl.value) {
    isPlaying.value = true;
    audioElement.value.pause();
    audioElement.value.src = audioUrl.value;
    audioElement.value.playbackRate = speed.value; // 设置播放速度
    audioElement.value.play();
  }
};

// 暂停音频
const pauseAudio = () => {
  audioElement.value.pause();
  isPlaying.value = false;
};

// 调整音频播放进度
const audioControl = (seconds) => {
  if (audioElement.value) {
    audioElement.value.currentTime += seconds;
  }
};

// 音频生成后跳转到新页面播放音频
const generateAudio = () => {
  if (audioUrl.value) {
    window.open(audioUrl.value, "_blank"); // 在新标签页打开音频
  }
};

// 处理语言选择
const handleLanguageChange = (value) => {
  language.value = value;
  isSelect.value = true;
};

// 创建音频合成任务并开始轮询
const audioPreview = async () => {
  if (text.value.trim() === "") return;

  const requestData = {
    type: "NORMAL_TTS",
    taskType: "NORMAL_TTS",
    content: text.value,
    userSoundId: language.value,
    rate: speed.value * 100,
  };

  generating.value = true;
  ElMessage({ message: "生成中...", type: "info" });

  try {
    const res = await taskExecutionService(requestData);
    if (res && res.data && res.data.id) {
      taskId.value = res.data.id;
      pollTaskStatus();
    }
  } catch (err) {
    console.error("创建任务失败", err);
    generating.value = false;
  }
};

// 每3秒查询一次任务状态
const pollTaskStatus = () => {
  const intervalId = setInterval(async () => {
    const res = await getTaskDetailById(taskId.value);
    if (res && res.data) {
      const messageBody = JSON.parse(res.data.messageBody);
      if (messageBody.status === 1) {
        audioUrl.value = messageBody.soundUrl; // 获取音频URL
        clearInterval(intervalId); // 停止轮询
        ElMessage.success("音频生成完成");
        generating.value = false;
      }
    }
  }, 3000); // 每3秒查询一次
};

// 分页功能
const audioList = ref([]);

const fetchTtsRecords = async () => {
  const form = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  };
  const res = await getNormalTtsRecord(form);
  if (res && res.records) {
    const audioListWithDuration = await Promise.all(
      res.records.map((record) => {
        return new Promise((resolve) => {
          const audio = new Audio();
          audio.src = record.fileUrl;
          audio.addEventListener("loadedmetadata", () => {
            resolve({
              ...record,
              name: record.voiceName,
              date: record.createTime,
              format: "MP3",
              duration: formatDuration(audio.duration),
              audioSrc: record.fileUrl,
              checked: false,
            });
          });
          audio.addEventListener("error", () => {
            console.error(`读取音频时长失败: ${record.fileUrl}`);
            resolve({
              ...record,
              name: record.voiceName,
              date: record.createTime,
              format: "MP3",
              duration: 0,
              audioSrc: record.fileUrl,
              checked: false,
            });
          });
        });
      })
    );

    audioList.value = audioListWithDuration;
  }
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const currentPage = ref(1);
const pageSize = ref(5);
const totalItems = ref(audioList.length);

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return audioList.slice(start, start + pageSize.value);
});

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};
// 删除处理逻辑
const handleDelete = async () => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const result = await delTtsRecord(record.id);
    if (result) {
      ElMessage.success("删除成功！");
      fetchTtsRecords();
    }
  } catch (err) {
    if (err !== "cancel") {
      ElMessage.error("删除失败，请重试！");
      console.error("删除失败:", err.message);
    }
  }
};

onMounted(() => {
  fetchAllAudioLibraries();
  handleOption();
  fetchTtsRecords();
});
</script>

<style scoped>
.up-box {
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin: 30px auto;
  min-height: 70vh;
  width: 1180px;
}
.left-box {
  flex: 3;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.head {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
.right-box {
  flex: 1.2;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.title {
  display: flex;
  gap: 5px;
  align-items: center;
}
.down-box {
  display: flex;
  flex-direction: column;
  margin: 40px auto;
  min-height: 60vh;
  width: 1180px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.audio-control {
  background-color: #f9f9f9;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 20px 0;
  gap: 15px;
  flex: 3;
}
.list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  padding-top: 0;
}
.item {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #dcdfe6;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
}
.left-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.right-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 50px;
}
.ico {
  background-color: #c0c4cc;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-pagination {
  justify-content: center;
  margin-bottom: 20px;
}
</style>