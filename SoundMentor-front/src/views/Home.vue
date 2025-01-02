<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";

const roomId = ref("");
const isMicOn = ref(true);
const isCameraOn = ref(true);
const isSharing = ref(false);

// 参会者列表
const participants = ref([
  { id: 1, name: "张三", isSpeaking: true, hasCamera: true, hasMic: true },
  { id: 2, name: "李四", isSpeaking: false, hasCamera: true, hasMic: false },
]);

// 创建会议
const createMeeting = () => {
  ElMessage.success("创建会议成功");
  // 这里添加创建会议的逻辑
};

// 加入会议
const joinMeeting = () => {
  if (!roomId.value) {
    ElMessage.warning("请输入会议号");
    return;
  }
  ElMessage.success("加入会议成功");
  // 这里添加加入会议的逻辑
};

// 控制设备
const toggleMic = () => {
  isMicOn.value = !isMicOn.value;
};

const toggleCamera = () => {
  isCameraOn.value = !isCameraOn.value;
};

const toggleScreenShare = () => {
  isSharing.value = !isSharing.value;
};
</script>

<template>
  <div class="meeting-container">
    <div class="meeting-header">
      <div class="meeting-controls">
        <el-button-group>
          <el-button :type="isMicOn ? 'primary' : 'info'" @click="toggleMic">
            <el-icon><Microphone /></el-icon>
          </el-button>
          <el-button
            :type="isCameraOn ? 'primary' : 'info'"
            @click="toggleCamera"
          >
            <el-icon><VideoCamera /></el-icon>
          </el-button>
          <el-button
            :type="isSharing ? 'primary' : 'info'"
            @click="toggleScreenShare"
          >
            <el-icon><Share /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <div class="meeting-content">
      <div class="meeting-sidebar">
        <div class="join-section">
          <el-input v-model="roomId" placeholder="请输入会议号">
            <template #append>
              <el-button @click="joinMeeting">加入会议</el-button>
            </template>
          </el-input>
          <el-button type="primary" @click="createMeeting" class="create-btn">
            创建新会议
          </el-button>
        </div>

        <div class="participants-list">
          <h3>参会者 ({{ participants.length }})</h3>
          <el-scrollbar height="400px">
            <div
              v-for="user in participants"
              :key="user.id"
              class="participant-item"
            >
              <el-avatar :size="32">{{ user.name.charAt(0) }}</el-avatar>
              <span class="participant-name">{{ user.name }}</span>
              <div class="participant-status">
                <el-icon v-if="user.isSpeaking" color="#67C23A"
                  ><Microphone
                /></el-icon>
                <el-icon v-if="user.hasCamera" color="#409EFF"
                  ><VideoCamera
                /></el-icon>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <div class="video-grid">
        <div class="video-placeholder">
          <el-empty description="等待加入会议..." />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meeting-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.meeting-header {
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}

.meeting-content {
  flex: 1;
  display: flex;
  background-color: #f5f7fa;
}

.meeting-sidebar {
  width: 300px;
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  padding: 20px;
}

.join-section {
  margin-bottom: 20px;
}

.create-btn {
  margin-top: 10px;
  width: 100%;
}

.participants-list h3 {
  margin-bottom: 16px;
}

.participant-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}
.participant-item：hover {
  background-color: #f5f7fa;
}

.participant-name {
  margin-left: 12px;
  flex: 1;
}

.participant-status {
  display: flex;
  gap: 8px;
}

.video-grid {
  flex: 1;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  overflow: auto;
}

.video-placeholder {
  background-color: #fff;
  border-radius: 8px;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>