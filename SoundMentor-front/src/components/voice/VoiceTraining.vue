<template>
  <div class="training-box">
    <text style="margin: 15px auto; font-size: 22px; font-weight: bold"
      >训练AI声音</text
    >
    <text style="margin: 0 auto"
      >通过上传或录制声音样本，训练属于你的个性化AI声音</text
    >
    <el-steps :active="activeStep" finish-status="success" class="step-bar">
      <el-step title="采集声音" description="上传或录制声音" />
      <el-step title="AI训练" description="训练模型" />
      <el-step title="声音微调" description="调整参数" />
      <el-step title="完成" description="添加到样本库" />
    </el-steps>
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
          <div class="el-upload__tip">支持格式：.mp3</div>
        </el-upload>
        <audio v-if="uploadedFiles.length > 0" :src="uploadedFiles[0].url" />
      </div>
      <div class="online-record">
        <h3>在线录制</h3>
        <el-icon color="#24a3ff" size="50"><Mic /></el-icon>
        <el-button
          :type="isRecording ? 'danger' : 'primary'"
          @click="toggleRecording"
        >
          {{ isRecording ? "停止录音" : "开始录音" }}
        </el-button>
      </div>
    </div>
    <div class="training-list" v-if="uploadedFiles.length > 0">
      <el-table :data="uploadedFiles" class="train-tb">
        <el-table-column prop="name" label="音频名称" />
        <el-table-column prop="duration" label="时长" />
        <el-table-column prop="size" label="大小" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="function" label="操作">
          <template v-slot="{ row }">
            <text style="color: #409eff" @click="confirmDelete(row.name)"
              >删除</text
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        @click="inputSoundName = true"
        class="start-btn"
        :disabled="uploadedFiles.length == 0"
        >开始训练</el-button
      >
      <!-- TODO -->
      <el-dialog v-model="inputSoundName" title="输入音频名称" width="30%">
        <el-input v-model="soundName" label="音频名称"></el-input>
        <el-input v-model="soundDescription" label="音频描述"></el-input>
        <div style="margin-top: 20px; padding: 0 140px">
          <el-button type="primary" @click="startTraining">确认</el-button>
          <el-button>取消</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- TODO -->
    <div style="margin: 20px auto">
      <el-button
        type="primary"
        @click="adjustParameters"
        :disabled="activeStep != 2"
      >
        调整参数
      </el-button>
      <el-button type="primary" @click="saveVoice" :disabled="activeStep != 3">
        保存
      </el-button>
    </div>
    <el-dialog title="确认删除" :visible="dialogVisible" @close="handleClose">
      <span>您确定要删除此音频文件吗？</span>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="deleteVoice">确认</el-button>
      </span>
    </el-dialog>
    <div class="task-status" v-if="taskStatus === 1">1111111111</div>
  </div>
</template>  

<script setup>
import { ref, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import { ElMessage } from "element-plus";
import { uploadFileService } from "@/api/file";
import { canAddVoice, getTrainedSoundPageQuery } from "@/api/voice";
import { taskExecutionService, getTaskDetailById } from "@/api/task";
import { Upload, MessageBox, Mic } from "@element-plus/icons-vue";

const uploadedFiles = ref([]);
const activeStep = ref(0); // 当前步骤

const handleFileUpload = async (file) => {
  const fileType = file.type;

  if (fileType != "audio/mpeg") {
    console.log(fileType);
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
          status: "未训练",
        });
      };
      activeStep.value = 1;
    }
  } catch (error) {
    ElMessage.error("文件上传失败，请重试！");
  }
  return false;
};

// 录制按钮
const isRecording = ref(false);
let mediaRecorder;
let audioChunks = [];
//开始录制
const startRecording = async () => {
  try {
    ElMessage({
      type: "info",
      message: "音频录制中",
    });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();
    isRecording.value = true;

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
  } catch (error) {
    ElMessage.error("无法使用麦克风: " + error.message);
    console.error(error);
  }
};
//停止录制
const stopRecording = () => {
  mediaRecorder.stop();
  isRecording.value = false;

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
    audioChunks = [];

    // 使用 UUID 生成文件名
    const fileName = `${uuidv4()}.mp3`;

    // 创建并下载 MP3 文件
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    handleFileUpload(audioBlob);
  };
};

//处理按钮状态逻辑
const toggleRecording = () => {
  isRecording.value ? stopRecording() : startRecording();
};

const taskStatus = ref(0);
let inputSoundName = ref(false);
const soundName = ref("");
const soundDescription = ref("");
// 训练逻辑
const startTraining = async () => {
  // 进行判断能否添加
  const res = await canAddVoice();
  if (res.code != 0) {
    ElMessage.error("训练声音已到达上限！");
    return false;
  }
  // 构造数据
  const url = uploadedFiles.value[0].url;
  const data = {
    type: "VOICE_TRAIN",
    taskType: "VOICE_TRAIN",
    soundPath: url,
    soundName: soundName.value,
    description: soundDescription.value,
  };
  try {
    const response = await taskExecutionService(data);
    if (response.code == "0") {
      //把第一位状态修改
      ElMessage.success("执行成功！");
      inputSoundName.value = false;
      uploadedFiles.value[0].status = "训练中";
      localStorage.setItem("voiceTaskId", response.data); //保存当前任务id
      activeStep.value = 2;
    } else {
      ElMessage.error("执行失败！", response.message);
    }
  } catch (err) {
    ElMessage.error(err.message);
  }
};
// 调整参数
const adjustParameters = () => {
  // 在这里处理参数调整逻辑...
  ElMessage.success("参数调整完成！");
  activeStep.value = 3; // 进入步骤 3
};
// 保存音频
const saveVoice = () => {
  activeStep.value = 4; // 完成
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
//删除上传音频
const dialogVisible = ref(false);
const fileToDelete = ref(null);
const confirmDelete = (name) => {
  fileToDelete.value = name;
  dialogVisible.value = true;
  console.log(dialogVisible.value);
};
const deleteVoice = () => {
  uploadedFiles.value = uploadedFiles.value.filter(
    (obj) => obj.name !== fileToDelete.value
  );
  fileToDelete.value = null;
  dialogVisible.value = false;
};
const handleClose = () => {
  fileToDelete.value = null;
  dialogVisible.value = false;
};
</script>

<style scoped>
.step-bar {
  width: auto;
  max-width: 1000px;
  margin: 20px 80px;
}
.training-box {
  margin: 0 140px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  border-radius: 0 0 10px 10px;
}
.voice-training {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 400px;
  padding: 15px 50px;
  margin-bottom: 30px;
  column-gap: 30px;
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

.training-list {
  margin: 20px 40px;
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
