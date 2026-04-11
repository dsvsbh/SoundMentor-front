<template>
  <!-- 音频设置 -->
  <div class="up-box">
    <div class="left-box">
      <div class="head">
        <div class="page-title">
          <text style="font-size: 30px; font-weight: bold">预设文本朗读</text>
          <div class="bar"></div>
        </div>
        <div>
          <el-button
            type="primary"
            :disabled="text.length === 0 || generating || !audioUrl"
            @click="playAudio"
            :icon="VideoPlay"
            v-if="!isPlaying"
            >音频试听</el-button
          >
          <el-button
            type="primary"
            :disabled="text.length === 0 || generating || !audioUrl"
            v-else
            @click="pauseAudio"
          >
            <el-icon color="#ffffff">
              <VideoPause />
            </el-icon>
            暂停试听
          </el-button>
          <el-button
            type="success"
            :disabled="text.length === 0 || generating"
            @click="generateVoice"
            style="margin-left: 10px"
            >生成语音</el-button
          >
        </div>
      </div>
      <el-divider />
      <el-input
        placeholder="请输入或粘贴教学内容（1-1000字）"
        v-model="text"
        type="textarea"
        :autosize="{ minRows: 16, maxRows: 16 }"
        style="width: 93%; margin: 0 25px"
        resize="none"
        :disabled="generating"
        maxlength="1000"
        show-word-limit
      />
      <div
        class="words"
        style="color: #cccccc; font-size: 14px; margin: 15px 25px"
      >
        当前字数：{{ text.length }} / 1000
      </div>
      <div v-if="audioUrl" class="audio-preview">
        <h4>音频预览</h4>
        <audio :src="audioUrl" controls style="width: 93%; margin: 0 25px"></audio>
        <div class="audio-control">
          <el-button-group class="btns">
            <el-button @click="audioControl(-15)">-15s</el-button>
            <el-button @click="playAudio" v-if="!isPlaying">播放</el-button>
            <el-button @click="pauseAudio" v-else>暂停</el-button>
            <el-button @click="audioControl(15)">+15s</el-button>
          </el-button-group>
        </div>
      </div>
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
      <div>
        <el-button 
          type="danger" 
          :disabled="selectedRecords.length === 0"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <div class="list">
      <template v-if="audioList.length > 0">
        <el-table 
          :data="paginatedItems" 
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="任务名称" min-width="200">
            <template #default="{ row }">
              <div style="display: flex; align-items: center; gap: 10px">
                <div class="ico">
                  <el-icon size="30" color="#ffffff"><Document /></el-icon>
                </div>
                <div>
                  <div style="font-size: 16px; font-weight: bold">{{ row.taskName }}</div>
                  <div style="font-size: 12px; color: #909399; margin-top: 4px">
                    声音: {{ row.voiceName }} | 语速: {{ row.speed }}x
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div style="display: flex; gap: 10px">
                <el-link type="primary" :href="row.fileUrl" :underline="false" target="_blank">
                  <el-icon><Download /></el-icon>下载
                </el-link>
                <el-link type="primary" :underline="false" @click="playRecordAudio(row)">
                  <el-icon><VideoPlay /></el-icon>播放
                </el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
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

  <!-- 选择声音弹窗 -->
  <el-dialog
    v-model="voiceDialogVisible"
    title="选择声音"
    width="600px"
  >
    <!-- 语速调节 -->
    <div class="speed-control">
      <div class="speed-label">语速: {{ voiceSpeed.toFixed(1) }}</div>
      <el-slider 
        v-model="voiceSpeed" 
        :min="0.5" 
        :max="2.0" 
        :step="0.1"
        :format-tooltip="formatSpeedTooltip"
      />
      <div class="speed-tips">
        <span>慢 (0.5)</span>
        <span>正常 (1.0)</span>
        <span>快 (2.0)</span>
      </div>
    </div>
    
    <div class="voice-list">
      <div 
        v-for="voice in voiceList" 
        :key="voice.id" 
        class="voice-item"
        :class="{ 'voice-item-selected': selectedVoice && selectedVoice.id === voice.id }"
        @click="selectVoice(voice)"
      >
        <div class="voice-info">
          <div class="voice-name">{{ voice.soundName }}</div>
          <div class="voice-desc">{{ voice.description }}</div>
        </div>
        <div class="voice-preview" @click.stop="previewVoice(voice)">
          <audio v-if="voice.soundUrl" :src="voice.soundUrl" controls @click.stop></audio>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="voiceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmGenerateVoice" :disabled="!selectedVoice">确认生成</el-button>
      </span>
    </template>
  </el-dialog>

  <el-backtop :right="100" :bottom="100" />
  <Footer />
</template>
<script setup>
import Footer from "@/components/headFoot/Footer.vue";
import {
  VideoPlay,
  VideoPause,
  Document,
  Download,
  Delete,
} from "@element-plus/icons-vue";
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import { listVoices } from "@/api/ppt";
import { generateNormalTts, getNormalTtsRecords, batchDeleteNormalTtsRecords } from "@/api/read";
import { ElMessageBox } from "element-plus";

const text = ref(""); // 用户输入文本
const audioUrl = ref(null); // 音频的URL
const audioElement = ref(new Audio()); // 音频播放元素
const generating = ref(false); // 是否正在生成音频
const isPlaying = ref(false); // 是否正在播放音频

// 声音选择弹窗相关
const voiceDialogVisible = ref(false);
const voiceList = ref([]);
const selectedVoice = ref(null);
const voiceSpeed = ref(1.0);
let currentPreviewAudio = null;

// 历史记录相关
const audioList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const selectedRecords = ref([]); // 选中的记录

// 播放音频
const playAudio = () => {
  if (audioUrl.value) {
    isPlaying.value = true;
    audioElement.value.pause();
    audioElement.value.src = audioUrl.value;
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

// 播放记录中的音频
const playRecordAudio = (record) => {
  if (record.fileUrl) {
    isPlaying.value = true;
    audioElement.value.pause();
    audioElement.value.src = record.fileUrl;
    audioElement.value.play();
    audioUrl.value = record.fileUrl;
    ElMessage.success("开始播放");
  }
};

// 打开声音选择弹窗
const generateVoice = async () => {
  if (text.value.trim() === "") {
    ElMessage.error("请输入文本内容！");
    return;
  }

  if (text.value.length > 1000) {
    ElMessage.error("文本内容不能超过1000字！");
    return;
  }

  // 打开弹窗并查询声音列表
  voiceDialogVisible.value = true;
  selectedVoice.value = null;
  
  // 停止当前正在播放的音频
  if (currentPreviewAudio) {
    currentPreviewAudio.pause();
    currentPreviewAudio = null;
  }

  // 查询声音列表
  try {
    const res = await listVoices();
    console.log("声音列表响应:", res);
    // 处理不同的响应格式
    let data = res.data || res;
    if (Array.isArray(data)) {
      voiceList.value = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      voiceList.value = data.data;
    } else {
      console.error("声音列表数据格式不正确:", data);
      ElMessage.error("获取声音列表失败");
    }
  } catch (error) {
    console.error("获取声音列表失败:", error);
    ElMessage.error("获取声音列表失败");
  }
};

// 选择声音
const selectVoice = (voice) => {
  selectedVoice.value = voice;
};

// 试听声音
const previewVoice = (voice) => {
  // 停止当前正在播放的音频
  if (currentPreviewAudio) {
    currentPreviewAudio.pause();
  }
  // 播放选中的音频
  const audioElements = document.querySelectorAll('.voice-preview audio');
  audioElements.forEach(audio => {
    if (audio !== event.target) {
      audio.pause();
    }
  });
};

// 格式化速度提示
const formatSpeedTooltip = (val) => {
  return val.toFixed(1);
};

// 确认生成语音
const confirmGenerateVoice = async () => {
  if (!selectedVoice.value) {
    ElMessage.warning("请选择一个声音！");
    return;
  }

  voiceDialogVisible.value = false;
  generating.value = true;
  
  const loading = ElLoading.service({
    lock: true,
    text: '正在生成音频...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  const requestData = {
    content: text.value,
    voiceName: selectedVoice.value.apiParam,
    speed: voiceSpeed.value,
  };

  try {
    const res = await generateNormalTts(requestData);
    if (res) {
      audioUrl.value = res.fileUrl;
      ElMessage.success("音频生成完成");
      // 重新加载历史记录
      await loadRecords();
    }
  } catch (err) {
    console.error("创建任务失败", err);
    ElMessage.error("生成失败，请重试");
  } finally {
    generating.value = false;
    loading.close();
  }
};

// 加载历史记录
const loadRecords = async () => {
  try {
    const res = await getNormalTtsRecords({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    });
    if (res) {
      audioList.value = res.records || [];
      totalItems.value = res.total || 0;
    }
  } catch (err) {
    console.error("加载历史记录失败", err);
  }
};

// 分页功能
const paginatedItems = computed(() => {
  return audioList.value;
});

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  loadRecords();
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRecords.value.length === 0) {
    ElMessage.warning("请选择要删除的记录");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRecords.value.length} 条记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const ids = selectedRecords.value.map(record => record.id);
    await batchDeleteNormalTtsRecords(ids);
    ElMessage.success("删除成功");
    selectedRecords.value = [];
    await loadRecords();
  } catch (err) {
    if (err !== "cancel") {
      ElMessage.error("删除失败，请重试");
      console.error("删除失败:", err);
    }
  }
};

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedRecords.value = selection;
};

// 格式化时间
const formatTime = (time) => {
  if (!time) return "";
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

onMounted(() => {
  // 加载历史记录
  loadRecords();
});
</script>

<style scoped>
.up-box {
  margin: 30px auto;
  min-height: 70vh;
  width: 1180px;
}
.left-box {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding-bottom: 30px;
}
.head {
  margin: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  display: flex;
  flex-direction: column;
}
.bar {
  width: 122px;
  height: 10px;
  background: linear-gradient(135deg, #3fa4fa, #36cfdd);
  margin-top: 8px;
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
  margin: 20px 25px;
  gap: 15px;
  border-radius: 8px;
}
.audio-preview {
  margin: 20px 25px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}
.audio-preview h4 {
  margin-bottom: 15px;
  color: #333;
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

/* 语速控制样式 */
.speed-control {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.speed-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.speed-tips {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

/* 声音列表样式 */
.voice-list {
  max-height: 400px;
  overflow-y: auto;
}

.voice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.voice-item:hover {
  border-color: #409eff;
  background-color: #f5f7fa;
}

.voice-item-selected {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.voice-info {
  flex: 1;
}

.voice-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.voice-desc {
  font-size: 12px;
  color: #999;
}

.voice-preview {
  margin-left: 20px;
}

.voice-preview audio {
  height: 32px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>