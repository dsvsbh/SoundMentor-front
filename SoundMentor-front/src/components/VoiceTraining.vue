<template>
  <!-- <div>
    <div class="progress-container">
      <div
        class="progress-circle"
        v-for="(step, index) in steps"
        :key="index"
        :class="{ active: currentStep >= index + 1 }"
        @click="goToStep(index + 1)"
      >
        {{ step }}
      </div>
      <div class="progress-line" :style="{ width: lineWidth }"></div>
    </div>
    <div class="buttons">
      <el-button
        v-for="(step, index) in steps"
        :key="index"
        @click="goToStep(index + 1)"
      >
        {{ step }}
      </el-button>
    </div>
  </div> -->
  <div class="training-box">
    <text style="margin: 15px auto; font-size: 22px; font-weight: bold"
      >训练AI声音</text
    >
    <text style="margin: 0 auto"
      >通过上传或录制声音样本，训练属于你的个性化AI声音</text
    >
    <div class="voice-training">
      <div class="upload-section">
        <el-upload
          v-model:file-list="uploadedFiles"
          class="upload-demo"
          drag
          multiple
          :before-upload="handleFileUpload"
        >
          <h3>上传音频文件</h3>
          <el-icon color="#24a3ff" size="50"><MessageBox /></el-icon>
          <div class="el-upload__text">点击或拖拽文件到这里上传</div>
          <div class="el-upload__tip">支持格式：.mp3, .ogg, .wav</div>
        </el-upload>
        <audio v-if="uploadedFiles.length > 0" :src="uploadedFiles[0].url" />
      </div>
      <div class="online-record">
        <h3>在线录制</h3>
        <el-icon color="#24a3ff" size="50"><Mic /></el-icon>
        <el-button
          :type="isRecording ? 'danger' : 'primary'"
          @click="startRecord"
          >{{ isRecording ? "停止录制" : "开始录制" }}</el-button
        >
      </div>
    </div>
    <div class="training-list" v-if="uploadedFiles.length > 0">
      <el-table :data="uploadedFiles" class="train-tb">
        <el-table-column prop="name" label="音频名称" />
        <el-table-column prop="duration" label="时长" />
        <el-table-column prop="size" label="大小" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="function" label="操作">
          <text style="color: #409eff">删除</text>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="startTraining" class="start-btn"
        >开始训练</el-button
      >
    </div>
  </div>
</template>  

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { uploadFileService } from "@/api/file";
import { canAddVoice } from "@/api/voice";
import { taskExecutionService, getTaskDetailById } from "@/api/task";
import { Upload, MessageBox, Mic } from "@element-plus/icons-vue";
const uploadedFiles = ref([]);

const handleFileUpload = async (file) => {
  if (file.type !== "audio/mpeg") {
    ElMessage.error("只支持音频文件格式: .mp3");
    return false;
  }
  try {
    const response = await uploadFileService(file);

    if (response.data && response.data.fileUrl) {
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        uploadedFiles.value.push({
          name: file.name,
          url: response.data.fileUrl,
          duration: audio.duration.toFixed(2) + "s",
          size: (file.size / 1048576).toFixed(2) + "MB",
          status: 0,
        });
      };
    }
  } catch (error) {
    ElMessage.error("文件上传失败，请重试！");
  }
  return false;
};
// 录制按钮
const isRecording = ref(false);
const startRecord = () => {
  isRecording.value = !isRecording.value;
};

// 训练逻辑
const startTraining = async () => {
  // 进行判断能否添加
  const res = await canAddVoice();
  if (res.code != 0) {
    ElMessage.error("训练声音已到达上限！");
    return false;
  }
  // 构造数据
  const data = {
    type: "VOICE_TRAIN",
    taskType: "VOICE_TRAIN",
    soundPath: uploadedFiles.value[0].url,
  };
  try {
    const response = await taskExecutionService(data);
    if (response.code == 0) {
      //把第一位状态修改
      ElMessage.success("执行成功！");
      uploadedFiles.value[0].status = 1; //训练中
      localStorage.setItem("voiceTaskId", response.data); //保存当前任务id
      // 状态如果为2就放在数组最后一位
    } else {
      ElMessage.error("执行失败！", response.message);
    }
  } catch (err) {
    ElMessage.error(err.message);
  }
};
// 进行长轮询
let intervalId;
onMounted(() => {
  const id = localStorage.getItem("taskId");
  if (id !== null) {
    searchQueryStatus();
    intervalId = setInterval(() => {
      searchQueryStatus();
      console.log("查询----");
    }, 3000); //3s一次
  }
});

// 查询任务状态
const searchQueryStatus = async () => {
  var taskId = localStorage.getItem("voiceTaskId");
  const res = await getTaskDetailById(taskId); //GET
  const status = JSON.parse(res.messageBody).status;
  if (res.status == 0 && status == 1) {
    ElMessage.success("训练完成！");
  }
};

// test
const steps = [1, 2, 3, 4];
const currentStep = ref(1);

const goToStep = (step) => {
  if (step > currentStep.value) {
    currentStep.value = step;
  }
};

const lineWidth = computed(() => {
  return `${((currentStep.value - 1) / (steps.length - 1)) * 100}%`;
});
</script>

<style scoped>
.training-box {
  margin: 0 150px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}
.voice-training {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 400px;
  padding: 15px;
  margin-bottom: 30px;
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
/* test */
.progress-container {
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  margin-bottom: 20px;
}

.progress-circle {
  border: 2px solid #d3d3d3;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border-color 0.3s;
  cursor: pointer;
}

.progress-circle.active {
  border-color: #409eff;
}

.progress-line {
  height: 2px;
  background-color: #9a3838;
  position: absolute;
  top: 14px;
  z-index: -1;
  transition: width 0.3s;
}
.progress-line.active {
  background-color: #409eff;
}

.buttons {
  display: flex;
  justify-content: space-between;
}
.training-list {
  margin: 20px;
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.train-tb {
  border-radius: 10px;
}
.start-btn {
  margin: 10px auto;
}
</style>
