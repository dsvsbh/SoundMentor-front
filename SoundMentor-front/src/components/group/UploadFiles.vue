<template>
  <el-dialog v-model="isUploadVisible" title="上传文件" width="70%">
    <div>
      <el-button
        v-for="(userButton, index) in userButtonList"
        :key="index"
        :style="userActiveButton === userButton ? userActiveStyle : {}"
        style="margin-bottom: 10px"
        @click="setUserActiveButton(userButton)"
        :disabled="loading"
      >
        {{ userButton }}
      </el-button>
      <el-input
        placeholder="搜索文件"
        style="width: 300px; margin-bottom: 10px; margin-left: 320px"
        v-model="userSearchTerm"
        @input="fetchUserFiles"
        :disabled="loading"
      >
        <template #prepend>
          <el-button :icon="Search" />
        </template>
      </el-input>
      <div class="user-file-list">
        <el-table :data="userFiles" style="width: 100%">
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column prop="fileSize" label="文件大小" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button @click="selectUserFile(scope.row)" :loading="loading"
                >选择</el-button
              >
              <!-- 显示 loading 状态 -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-btns">
        <el-button
          @click="changeUserPage(userCurrentPage - 1)"
          :disabled="userCurrentPage === 1 || loading"
          >上一页</el-button
        >
        <el-button>{{ userCurrentPage }}</el-button>
        <el-button
          @click="changeUserPage(userCurrentPage + 1)"
          :disabled="userCurrentPage === userTotalPages || loading"
          >下一页</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>  
  
<script setup>
import { ref, watch } from "vue";
import { getUserFiles } from "@/api/user";
import { uploadFileToGroup } from "@/api/group";
import { formatDate } from "@/utils/TimeFromUtil";
import {
  User,
  Files,
  Calendar,
  UploadFilled,
  Document,
  Download,
  Delete,
  Setting,
  Search,
  InfoFilled,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
// 状态管理
const isUploadVisible = ref(false);
const userButtonList = ref(["全部", "音频", "文档", "图片", "PPT"]);
const userActiveButton = ref("全部");
const userSearchTerm = ref("");
const userFiles = ref([]);
const userCurrentPage = ref(1);
const userPageSize = ref(5);
const userTotalFiles = ref(0);
const userTotalPages = ref(0);
const userSelectedFileTypes = ref([]); // 存储选中的文件类型

const userActiveStyle = {
  backgroundColor: "#409EFF",
  color: "#fff",
};
const props = defineProps({
  isUploadVisible: Boolean,
  organizationId: String,
});
const getSelectedFileTypes = () => {
  const typeMap = {
    // 文件类型映射
    全部: ["MP3", "DOC", "DOCX", "PDF", "PPTX", "PNG", "JPG"],
    PPT: ["PPTX"],
    音频: ["MP3"],
    图片: ["PNG", "JPG"],
    文档: ["DOC", "DOCX", "PDF"],
  };
  return typeMap[userActiveButton.value] || []; // 返回对应文件类型
};

// 设置活动按钮并重新获取文件
const setUserActiveButton = (button) => {
  userActiveButton.value = button;

  const selectedTypes = getSelectedFileTypes(); // 获取当前按钮对应的文件类型
  const existingTypes = userSelectedFileTypes.value;

  selectedTypes.forEach((type) => {
    const typeIndex = existingTypes.indexOf(type);
    if (typeIndex > -1) {
      existingTypes.splice(typeIndex, 1); // 取消选择
    } else {
      existingTypes.push(type); // 选择文件类型
    }
  });

  fetchUserFiles(); // 重新获取文件列表
};

// 获取文件列表
const fetchUserFiles = async () => {
  const userPageDTO = {
    fileTypes: getSelectedFileTypes(),
    fileName: userSearchTerm.value,
    pageNum: userCurrentPage.value,
    pageSize: userPageSize.value,
  };

  try {
    const response = await getUserFiles(userPageDTO);
    if (response.code === "0") {
      userFiles.value = response.data.records.map((file) => ({
        ...file,
        fileName: formatFileName(file.fileName), // 格式化文件名
        fileSize: (file.fileSize / 1024).toFixed(2) + "B",
        createTime: formatDate(file.createTime), // 格式化创建时间
      }));

      userTotalFiles.value = response.data.total; // 更新总文件数
      userTotalPages.value = Math.ceil(
        userTotalFiles.value / userPageSize.value
      ); // 计算总页数
    } else {
      console.error(response.message);
    }
  } catch (error) {
    console.error("请求失败:", error);
  }
};

// 改变页面
const changeUserPage = (newPage) => {
  if (newPage > 0 && newPage <= userTotalPages.value) {
    userCurrentPage.value = newPage;
    fetchUserFiles(); // 重新获取文件
  }
};

// 监听文件类型和搜索条件的变化
watch([userSelectedFileTypes, userSearchTerm], () => {
  userCurrentPage.value = 1; // 重置为第一页
  fetchUserFiles(); // 重新获取文件
});

// 初始加载
fetchUserFiles();

// 文件名格式化函数
const formatFileName = (fileName) => {
  const maxLength = 10; // 最大长度
  return fileName && fileName.length > maxLength
    ? `${fileName.slice(0, maxLength)}...`
    : fileName || "未知文件"; // 处理undefined
};

// 选择文件的逻辑
const loading = ref(false);
const selectUserFile = async (file) => {
  const orgId = parseInt(props.organizationId, 10); //组织ID
  const form = {
    fileId: file.fileId,
    organizationId: orgId,
  };
  const res = await uploadFileToGroup(form);
  if (res.code === "0") {
    ElMessage.success("上传成功！");
  } else {
    ElMessage.error("上传失败:", res.message);
  }
  console.log("选择的文件:", file);
};
</script>  

<style scoped>
.user-file-list {
  gap: 10px;
}
.file-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
}
.page-btns {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>