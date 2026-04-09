<template>
  <div class="ppt-container">
    <div class="ppt-box">
      <div class="title">有声课件制作</div>
      
      <!-- 标签页：新建任务 / 历史任务 -->
      <el-tabs v-model="activeTab" class="task-tabs" @tab-change="handleTabChange">
        <!-- 课件制作标签 -->
        <el-tab-pane label="课件制作" name="new">
          <div class="upload-ppt">
            <el-upload
              v-model:file-list="uploadedFiles"
              class="upload-demo"
              drag
              :on-change="handleFileChange"
              :auto-upload="false"
            >
              <div style="height: 100px">
                <el-icon color="#24a3ff" size="50"><UploadFilled /></el-icon>
                <div class="el-upload__text">点击或拖拽文件到这里上传</div>
                <div class="el-upload__tip">支持格式：.ppt, .pptx</div>
              </div>
            </el-upload>
            <el-button
              type="primary"
              @click="createPptTask"
              :disabled="!isUploadPPT"
              >创建课件任务</el-button
            >
          </div>
          
          <!-- 任务状态和预览图 -->
          <div v-if="taskId" class="task-status">
            <h3>任务状态</h3>
            <div v-if="taskName" class="task-name">
              <el-tag type="info">{{ taskName || '未命名任务' }}</el-tag>
            </div>
            <el-progress :percentage="progress" :status="progressStatus" />
            <p>{{ statusMessage }}</p>
            
            <!-- 预览图和内容展示 -->
            <div v-if="previewImages.length > 0" class="preview-section">
              <h4>课件内容</h4>
              
              <!-- 页码选择器 -->
              <div class="page-selector">
                <el-pagination
                  v-model:current-page="currentPage"
                  :page-size="1"
                  layout="prev, pager, next"
                  :total="previewImages.length"
                  @current-change="handlePageChange"
                />
              </div>
              
              <!-- 当前页预览图 -->
              <div class="current-preview">
                <el-image
                  :src="currentPreviewImage"
                  fit="contain"
                  class="current-preview-image"
                />
                
                <!-- 讲解和语音 -->
                <div v-if="currentTaskDetail" class="slide-content">
                  <div v-if="currentTaskDetail.explanationText" class="explanation">
                    <div class="explanation-header">
                      <h5>讲解内容</h5>
                      <div v-if="!isEditing" class="explanation-actions">
                        <el-button type="primary" size="small" @click="startEditing">编辑讲解</el-button>
                      </div>
                      <div v-else class="explanation-actions">
                        <el-button type="success" size="small" @click="saveExplanation">确认</el-button>
                        <el-button size="small" @click="cancelEditing">取消</el-button>
                      </div>
                    </div>
                    <div v-if="!isEditing" class="explanation-text">
                      {{ currentTaskDetail.explanationText }}
                    </div>
                    <div v-else class="explanation-edit">
                      <el-input
                        type="textarea"
                        v-model="editingExplanation"
                        :rows="6"
                        placeholder="请输入讲解内容"
                      />
                    </div>
                  </div>
                  <div v-if="currentTaskDetail.explanationAudioUrl" class="audio">
                    <h5>讲解语音</h5>
                    <audio :src="currentTaskDetail.explanationAudioUrl" controls></audio>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div v-if="taskStatus === 0" class="task-actions">
              <el-button type="primary" @click="handleGenerateExplanation">生成讲解</el-button>
            </div>
            <div v-if="taskStatus === 3" class="task-actions">
              <el-button type="primary" @click="generateVoice">生成讲解语音</el-button>
            </div>
            <div v-if="taskStatus === 6" class="task-actions">
              <el-button type="primary" @click="handleGenerateSoundPPT">生成有声课件</el-button>
            </div>
            <!-- 重试按钮 -->
            <div v-if="taskStatus === 2" class="task-actions">
              <el-button type="warning" @click="handleGenerateExplanation">重试生成讲解</el-button>
            </div>
            <div v-if="taskStatus === 5" class="task-actions">
              <el-button type="warning" @click="generateVoice">重试生成语音</el-button>
            </div>
            <div v-if="taskStatus === 8" class="task-actions">
              <el-button type="warning" @click="handleGenerateSoundPPT">重试生成有声课件</el-button>
            </div>
            <!-- 下载按钮 -->
            <div v-if="taskStatus === 9 && taskData && taskData.audioPptFileUrl" class="task-actions">
              <el-button type="success" @click="downloadAudioPPT">下载有声课件</el-button>
              <el-button @click="downloadOriginalPPT">下载原始课件</el-button>
            </div>
            <div v-else-if="taskData && taskData.originalPptFileUrl" class="task-actions">
              <el-button @click="downloadOriginalPPT">下载原始课件</el-button>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 历史任务标签 -->
        <el-tab-pane label="历史任务" name="history">
          <div class="history-tasks-header">
            <el-button 
              type="danger" 
              size="small" 
              @click="showDeleteDialog" 
              :disabled="selectedTaskIds.length === 0"
            >
              删除选中任务
            </el-button>
          </div>
          <div class="history-tasks">
            <el-empty v-if="historyTasks.length === 0" description="暂无历史任务" />
            <el-card v-for="task in historyTasks" :key="task.id" class="history-task-card">
              <template #header>
                <div class="task-header">
                  <el-checkbox v-model="selectedTaskIds" :label="task.id" />
                  <span>{{ task.taskName || '未命名任务' }}</span>
                  <el-tag :type="getTaskStatusType(task.taskStatus)">{{ getTaskStatusText(task.taskStatus) }}</el-tag>
                </div>
              </template>
              <div class="task-info">
                <p>创建时间：{{ formatDate(task.createdAt) }}</p>
                <p>总页数：{{ task.totalPages }}页</p>
              </div>
              <div class="task-actions">
                <el-button type="primary" size="small" @click="loadHistoryTask(task.id)">
                  {{ task.taskStatus === 9 ? '查看' : '继续' }}
                </el-button>
                <el-button v-if="task.audioPptFileUrl" size="small" @click="downloadAudioPPTByTask(task)">
                  下载有声课件
                </el-button>
                <el-button size="small" @click="downloadOriginalPPTByTask(task)">
                  下载原始课件
                </el-button>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

  <!-- 任务名称输入弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    title="创建课件任务"
    width="400px"
  >
    <el-form :model="{ taskName }" label-width="80px">
      <el-form-item label="任务名称">
        <el-input v-model="taskName" placeholder="请输入任务名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelCreateTask">取消</el-button>
        <el-button type="primary" @click="confirmCreateTask">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 删除确认弹窗 -->
  <el-dialog
    v-model="deleteDialogVisible"
    title="删除任务确认"
    width="400px"
  >
    <p>确定要删除选中的 {{ selectedTaskIds.length }} 个任务吗？此操作不可恢复。</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDeleteTasks">确认删除</el-button>
      </span>
    </template>
  </el-dialog>

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
import { ref, onUnmounted, onMounted, computed } from "vue";
import { uploadFileService } from "@/api/file";
import { createPPTTask, generateExplanation, generateExplanationVoice, generateSoundPPT, queryTask, listTasks, batchDeleteTasks, editExplanation, listVoices } from "@/api/ppt";
import { ElMessage, ElLoading } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
const router = useRouter();
import Footer from "@/components/headFoot/Footer.vue";

const uploadedFiles = ref([]);
const selectedFile = ref(null);
const latestFileInfo = ref(null); // 保存最新上传的文件信息
const isUploadPPT = ref(false);
const taskId = ref('');
const taskStatus = ref('');
const progress = ref(0);
const progressStatus = ref('');
const statusMessage = ref('');
const previewImages = ref([]);
const pollingInterval = ref(null);
const loading = ref(null);
const taskData = ref(null);

// 历史任务相关
const activeTab = ref('new');
const historyTasks = ref([]);
const currentPage = ref(1);
const taskDetails = ref([]);
const taskName = ref('');
const dialogVisible = ref(false);
const selectedTaskIds = ref([]);
const deleteDialogVisible = ref(false);

// 声音选择弹窗相关
const voiceDialogVisible = ref(false);
const voiceList = ref([]);
const selectedVoice = ref(null);
const voiceSpeed = ref(1.0);
let currentPreviewAudio = null;

// 格式化速度提示
const formatSpeedTooltip = (val) => {
  return val.toFixed(1);
};

// 编辑讲解相关
const isEditing = ref(false);
const editingExplanation = ref('');

// 计算当前页的预览图
const currentPreviewImage = computed(() => {
  if (previewImages.value.length > 0 && currentPage.value <= previewImages.value.length) {
    return previewImages.value[currentPage.value - 1];
  }
  return '';
});

// 计算当前页的任务详情
const currentTaskDetail = computed(() => {
  if (taskDetails.value.length > 0 && currentPage.value <= taskDetails.value.length) {
    return taskDetails.value[currentPage.value - 1];
  }
  return null;
});

// 加载历史任务
const loadHistoryTasks = async () => {
  try {
    const response = await listTasks();
    if (response.data) {
      historyTasks.value = response.data;
    }
  } catch (error) {
    console.error("加载历史任务失败:", error);
    ElMessage.error("加载历史任务失败，请重试！");
  }
};

// 加载历史任务详情
const loadHistoryTask = async (taskIdVal) => {
  taskId.value = taskIdVal;
  activeTab.value = 'new';
  
  // 开始轮询任务状态
  startPolling();
};

// 获取任务状态类型（用于标签样式）
const getTaskStatusType = (status) => {
  switch (status) {
    case 0: // CREATED
    case 1: // EXPLANATION_GENERATING
    case 4: // EXPLANATION_VOICE_GENERATING
    case 7: // AUDIO_PPT_GENERATING
      return 'warning';
    case 3: // EXPLANATION_GENERATED
    case 6: // EXPLANATION_VOICE_GENERATED
      return 'info';
    case 9: // AUDIO_PPT_GENERATED
      return 'success';
    case 2: // EXPLANATION_GENERATION_FAILED
    case 5: // EXPLANATION_VOICE_GENERATION_FAILED
    case 8: // AUDIO_PPT_GENERATION_FAILED
      return 'danger';
    default:
      return 'default';
  }
};

// 获取任务状态文本
const getTaskStatusText = (status) => {
  const statusMap = {
    0: '创建',
    1: '讲解生成中',
    2: '讲解生成失败',
    3: '讲解已生成',
    4: '语音生成中',
    5: '语音生成失败',
    6: '语音已生成',
    7: '有声PPT生成中',
    8: '有声PPT生成失败',
    9: '有声PPT已生成'
  };
  return statusMap[status] || '未知状态';
};

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 处理标签页切换
const handleTabChange = (tab) => {
  if (tab === 'history') {
    // 切换到历史任务标签时，重新加载历史任务
    loadHistoryTasks();
  }
};

// 组件挂载时加载历史任务
onMounted(() => {
  loadHistoryTasks();
});

// 处理文件选择
const handleFileChange = async (file, fileList) => {
  // 只保留最新选择的文件
  if (fileList.length > 1) {
    fileList.splice(0, fileList.length - 1);
  }
  
  const currentFile = fileList[0];
  if (!currentFile) return;
  
  const isPptFile = currentFile.name.endsWith(".ppt") || currentFile.name.endsWith(".pptx");

  if (!isPptFile) {
    ElMessage.error("请上传有效的PPT或PPTX文件！");
    uploadedFiles.value = [];
    selectedFile.value = null;
    latestFileInfo.value = null;
    isUploadPPT.value = false;
    return;
  }

  // Element Plus的文件对象中，原始文件在raw属性中
  selectedFile.value = currentFile.raw || currentFile;
  uploadedFiles.value = fileList;
  
  // 直接上传文件
  await uploadFile();
};

// 上传文件
const uploadFile = async () => {
  if (!selectedFile.value) {
    ElMessage.error("请先选择文件！");
    return;
  }

  const file = selectedFile.value;
  loading.value = ElLoading.service({ fullscreen: true, text: '上传中...' });

  try {
    // 确保传递的是原始文件对象
    const response = await uploadFileService(file);

    if (response.data && response.data.fileUrl) {
      // 保存最新上传的文件信息
      latestFileInfo.value = {
        name: file.name,
        pptUrl: response.data.fileUrl,
      };
      
      uploadedFiles.value = [latestFileInfo.value];
      ElMessage.success("文件上传成功！");
      isUploadPPT.value = true;
    }
  } catch (error) {
    console.error("文件上传失败:", error);
    ElMessage.error("文件上传失败，请重试！");
  } finally {
    if (loading.value) {
      loading.value.close();
    }
  }
};



// 创建PPT任务
const createPptTask = async () => {
  if (!latestFileInfo.value || !latestFileInfo.value.pptUrl) {
    ElMessage.error("请先上传PPT文件！");
    return;
  }

  // 打开任务名称输入弹窗
  dialogVisible.value = true;
};

// 确认创建任务
const confirmCreateTask = async () => {
  // 使用最新上传的文件创建任务
  const pptUrl = latestFileInfo.value.pptUrl;
  loading.value = ElLoading.service({ fullscreen: true, text: '创建任务中...' });

  try {
    // 调用PPTController的创建任务接口
    const taskResponse = await createPPTTask(pptUrl, taskName.value);
    taskId.value = taskResponse.data; // 任务 ID

    ElMessage({ message: "任务创建成功，正在处理...", type: "success" });

    // 关闭弹窗
    dialogVisible.value = false;
    taskName.value = '';

    // 开始轮询任务状态
    startPolling();
  } catch (error) {
    console.error("创建任务失败:", error);
    ElMessage({ message: "创建任务失败，请重试。", type: "error" });
  } finally {
    if (loading.value) {
      loading.value.close();
    }
  }
};

// 取消创建任务
const cancelCreateTask = () => {
  dialogVisible.value = false;
  taskName.value = '';
};

// 显示删除确认对话框
const showDeleteDialog = () => {
  if (selectedTaskIds.value.length > 0) {
    deleteDialogVisible.value = true;
  }
};

// 确认删除任务
const confirmDeleteTasks = async () => {
  loading.value = ElLoading.service({ fullscreen: true, text: '删除任务中...' });

  try {
    await batchDeleteTasks(selectedTaskIds.value);
    ElMessage({ message: "任务删除成功", type: "success" });
    deleteDialogVisible.value = false;
    selectedTaskIds.value = [];
    // 重新加载历史任务
    loadHistoryTasks();
  } catch (error) {
    console.error("删除任务失败:", error);
    ElMessage({ message: "删除任务失败，请重试。", type: "error" });
  } finally {
    if (loading.value) {
      loading.value.close();
    }
  }
};

// 生成讲解
const handleGenerateExplanation = async () => {
  if (!taskId.value) {
    ElMessage.error("请先创建任务！");
    return;
  }

  loading.value = ElLoading.service({ fullscreen: true, text: '生成讲解中...' });

  try {
    await generateExplanation(taskId.value);
    ElMessage({ message: "讲解生成任务已启动", type: "success" });
    // 开始轮询任务状态
    startPolling();
  } catch (error) {
    console.error("生成讲解失败:", error);
    ElMessage({ message: "生成讲解失败，请重试。", type: "error" });
  } finally {
    if (loading.value) {
      loading.value.close();
    }
  }
};

// 生成讲解语音 - 打开声音选择弹窗
const generateVoice = async () => {
  if (!taskId.value) {
    ElMessage.error("请先创建任务！");
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

// 确认生成语音
const confirmGenerateVoice = async () => {
  if (!selectedVoice.value) {
    ElMessage.warning("请选择一个声音！");
    return;
  }

  voiceDialogVisible.value = false;

  loading.value = ElLoading.service({ fullscreen: true, text: '生成讲解语音中...' });

  try {
    await generateExplanationVoice({
      taskId: taskId.value,
      voice: selectedVoice.value.apiParam,
      speed: voiceSpeed.value
    });
    ElMessage({ message: "语音生成任务已启动", type: "success" });
    // 开始轮询任务状态
    startPolling();
  } catch (error) {
    console.error("生成讲解语音失败:", error);
    ElMessage({ message: "生成讲解语音失败，请重试。", type: "error" });
  } finally {
    if (loading.value) {
      loading.value.close();
    }
  }
};

// 生成有声PPT
const handleGenerateSoundPPT = async () => {
  if (!taskId.value) {
    ElMessage.error("请先创建任务！");
    return;
  }

  loading.value = ElLoading.service({ fullscreen: true, text: '生成有声课件中...' });

  try {
    await generateSoundPPT(taskId.value);
    ElMessage({ message: "有声课件生成任务已启动", type: "success" });
    // 开始轮询任务状态
    startPolling();
  } catch (error) {
    console.error("生成有声课件失败:", error);
    ElMessage({ message: "生成有声课件失败，请重试。", type: "error" });
  } finally {
    if (loading.value) {
      loading.value.close();
    }
  }
};

// 开始轮询任务状态
const startPolling = () => {
  // 立即查询一次
  checkTaskStatus();

  // 设置轮询间隔
  pollingInterval.value = setInterval(() => {
    checkTaskStatus();
  }, 3000); // 每3秒查询一次
};

// 检查任务状态
const checkTaskStatus = async () => {
  if (!taskId.value) return;

  try {
    // 调用PPTController的任务查询接口
    const taskDetail = await queryTask(taskId.value);
    
    if (taskDetail && taskDetail.data) {
      const status = taskDetail.data.taskStatus;
      taskStatus.value = status;
      
      // 更新任务名称
      if (taskDetail.data.taskName) {
        taskName.value = taskDetail.data.taskName;
      }
      
      // 保存任务详情
      if (taskDetail.data.detailList) {
        taskDetails.value = taskDetail.data.detailList;
        previewImages.value = taskDetail.data.detailList.map(detail => detail.imgUrl).filter(Boolean);
      }
      
      // 保存完整任务数据
      taskData.value = taskDetail.data;
      
      // 更新状态信息
      switch (status) {
        case 0: // CREATED
          progress.value = 20;
          progressStatus.value = 'warning';
          statusMessage.value = '任务已创建，等待生成讲解...';
          // 停止轮询（只有生成中状态需要轮询）
          stopPolling();
          break;
        case 1: // EXPLANATION_GENERATING
          progress.value = 40;
          progressStatus.value = 'warning';
          statusMessage.value = '讲解生成中...';
          // 继续轮询
          break;
        case 2: // EXPLANATION_GENERATION_FAILED
          progress.value = 0;
          progressStatus.value = 'exception';
          statusMessage.value = '讲解生成失败，请重试！';
          // 停止轮询
          stopPolling();
          break;
        case 3: // EXPLANATION_GENERATED
          progress.value = 60;
          progressStatus.value = 'info';
          statusMessage.value = '讲解已生成，等待生成语音...';
          // 停止轮询
          stopPolling();
          break;
        case 4: // EXPLANATION_VOICE_GENERATING
          progress.value = 75;
          progressStatus.value = 'warning';
          statusMessage.value = '语音生成中...';
          // 继续轮询
          break;
        case 5: // EXPLANATION_VOICE_GENERATION_FAILED
          progress.value = 0;
          progressStatus.value = 'exception';
          statusMessage.value = '语音生成失败，请重试！';
          // 停止轮询
          stopPolling();
          break;
        case 6: // EXPLANATION_VOICE_GENERATED
          progress.value = 85;
          progressStatus.value = 'info';
          statusMessage.value = '语音已生成，等待生成有声课件...';
          // 停止轮询
          stopPolling();
          break;
        case 7: // AUDIO_PPT_GENERATING
          progress.value = 95;
          progressStatus.value = 'warning';
          statusMessage.value = '有声课件生成中...';
          // 继续轮询
          break;
        case 8: // AUDIO_PPT_GENERATION_FAILED
          progress.value = 0;
          progressStatus.value = 'exception';
          statusMessage.value = '有声课件生成失败，请重试！';
          // 停止轮询
          stopPolling();
          break;
        case 9: // AUDIO_PPT_GENERATED
          progress.value = 100;
          progressStatus.value = 'success';
          statusMessage.value = '有声课件已生成！';
          // 停止轮询
          stopPolling();
          break;
        default:
          progress.value = 0;
          statusMessage.value = '未知状态';
          // 停止轮询
          stopPolling();
      }
    }
  } catch (error) {
    console.error("查询任务状态失败:", error);
  }
};

// 停止轮询
const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
};



// 开始编辑讲解
const startEditing = () => {
  if (currentTaskDetail.value) {
    editingExplanation.value = currentTaskDetail.value.explanationText;
    isEditing.value = true;
  }
};

// 取消编辑
const cancelEditing = () => {
  isEditing.value = false;
  editingExplanation.value = '';
};

// 保存讲解
const saveExplanation = async () => {
  if (!currentTaskDetail.value) return;
  
  loading.value = ElLoading.service({ fullscreen: true, text: '保存讲解中...' });

  try {
    // 调用编辑讲解接口
    await editExplanation({
      pptTaskDetailId: currentTaskDetail.value.id,
      newExplanation: editingExplanation.value
    });
    
    // 更新前端数据
    currentTaskDetail.value.explanationText = editingExplanation.value;
    
    // 找到对应的任务详情并更新
    const index = taskDetails.value.findIndex(
      detail => detail.id === currentTaskDetail.value.id
    );
    if (index !== -1) {
      taskDetails.value[index].explanationText = editingExplanation.value;
    }
    
    ElMessage({ message: "讲解保存成功", type: "success" });
    isEditing.value = false;
  } catch (error) {
    console.error("保存讲解失败:", error);
    ElMessage({ message: "保存讲解失败，请重试。", type: "error" });
  } finally {
    if (loading.value) {
      loading.value.close();
    }
  }
};

// 下载有声PPT
const downloadAudioPPT = () => {
  if (taskData.value && taskData.value.audioPptFileUrl) {
    window.open(taskData.value.audioPptFileUrl, '_blank');
  }
};

// 下载原始PPT
const downloadOriginalPPT = () => {
  if (taskData.value && taskData.value.originalPptFileUrl) {
    window.open(taskData.value.originalPptFileUrl, '_blank');
  }
};

// 下载历史任务的有声PPT
const downloadAudioPPTByTask = (task) => {
  if (task.audioPptFileUrl) {
    window.open(task.audioPptFileUrl, '_blank');
  }
};

// 下载历史任务的原始PPT
const downloadOriginalPPTByTask = (task) => {
  if (task.originalPptFileUrl) {
    window.open(task.originalPptFileUrl, '_blank');
  }
};

// 组件卸载时停止轮询
onUnmounted(() => {
  stopPolling();
});
</script>
<style scoped>
.ppt-container {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 30px 0;
  margin: 0 auto;
  width: 1175px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.title {
  font-size: 20px;
  color: #5d5d5d;
  font-weight: bold;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}
.ppt-box {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.upload-ppt {
  padding: 30px 60px;
}
.upload-demo {
  padding: 20px;
  margin-bottom: 20px;
}
.task-tabs {
  margin: 0 60px 30px;
}
.task-status {
  padding: 0 60px 30px;
}
.task-status h3 {
  margin-bottom: 15px;
  color: #333;
}
.task-name {
  margin-bottom: 15px;
}
.task-status p {
  margin-top: 10px;
  color: #666;
}
.preview-section {
  margin-top: 30px;
}
.preview-section h4 {
  margin-bottom: 15px;
  color: #333;
}
.page-selector {
  margin-bottom: 20px;
  text-align: center;
}
.current-preview {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}
.current-preview-image {
  width: 500px;
  height: 350px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.slide-content {
  flex: 1;
  min-width: 400px;
}
.explanation {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
.explanation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.explanation-header h5 {
  margin: 0;
  color: #333;
}
.explanation-actions {
  display: flex;
  gap: 5px;
}
.explanation-text {
  line-height: 1.6;
  color: #666;
  min-height: 100px;
}
.explanation-edit {
  margin-top: 10px;
}
.explanation-edit .el-textarea {
  width: 100%;
}
.audio {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
.audio h5 {
  margin-bottom: 10px;
  color: #333;
}
.audio audio {
  width: 100%;
  margin-top: 5px;
}
.task-actions {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}
.history-tasks-header {
  padding: 0 60px 15px;
  display: flex;
  justify-content: flex-end;
}

.history-tasks-header {
  padding: 0 60px 15px;
  display: flex;
  justify-content: flex-end;
}

.history-tasks {
  padding: 0 60px 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
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

.task-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-header span {
  flex: 1;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-header span {
  flex: 1;
}
.history-task-card {
  transition: all 0.3s ease;
}
.history-task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-info {
  margin: 10px 0;
  color: #666;
}
.task-info p {
  margin: 5px 0;
}
</style>