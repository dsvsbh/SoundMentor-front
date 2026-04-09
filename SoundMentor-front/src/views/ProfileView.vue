<template>
  <div class="container">
    <div class="header" @mousemove="updateBackground" :style="{ background }">
      <div>
        <img :src="userInfo.headImg" class="avatar" />
        <div class="under-avatar">
          <div class="left">
            <div class="username">{{ userInfo.username }}</div>
            <div class="id">ID: 1000{{ userInfo.id }}</div>
            <div class="registration-date">
              注册时间: {{ userInfo.createdTime }}
            </div>
          </div>
          <el-upload
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="handleUpload"
            class="upload-btn"
          >
            <template #trigger>
              <el-button type="default"
                ><el-icon><Upload /></el-icon>上传头像</el-button
              >
            </template>
          </el-upload>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <el-container>
      <el-aside class="aside">
        <el-menu :default-active="activeTab" @select="handleSelect">
          <el-menu-item
            :style="activeTab === '基本信息' ? activeTabColor : {}"
            @click="activeTab = '基本信息'"
            index="1"
          >
            <template #title>
              <el-icon><User /></el-icon>
              <span>基本信息</span>
            </template>
          </el-menu-item>
          <el-menu-item
            :style="activeTab === '修改密码' ? activeTabColor : {}"
            @click="activeTab = '修改密码'"
            index="2"
          >
            <template #title>
              <el-icon><Lock /></el-icon>
              <span>修改密码</span>
            </template>
          </el-menu-item>
          <el-menu-item
            :style="activeTab === '我的文件' ? activeTabColor : {}"
            @click="activeTab = '我的文件'"
            index="3"
          >
            <template #title>
              <el-icon><Upload /></el-icon>
              <span>我的文件</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <!-- 基本信息 -->
        <template v-if="activeTab === '基本信息'">
          <text style="font-size: 24px; font-weight: bold; margin-left: 60px"
            >基本信息</text
          >
          <div class="info-form">
            <el-form :model="userForm" :rules="rules" ref="userFormRef">
              <div class="center">
                <div class="left">
                  <el-form-item label="用户名" prop="name">
                    <el-input v-model="userForm.name" />
                  </el-form-item>
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userForm.phone" />
                  </el-form-item>
                </div>
                <div class="right">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email" disabled="true" />
                  </el-form-item>
                  <el-form-item label="账号" prop="username">
                    <el-input v-model="userForm.username" disabled="true" />
                  </el-form-item>
                </div>
              </div>
              <el-button
                type="primary"
                @click="saveUserInfo"
                :disabled="!isFormModified"
                style="width: 200px; margin: 20px 200px"
                >确认修改
              </el-button>
            </el-form>
          </div>
        </template>
        <!-- 修改密码 -->
        <template v-if="activeTab === '修改密码'">
          <text style="font-size: 24px; font-weight: bold; margin-left: 60px"
            >修改密码</text
          >
          <div class="password-form">
            <el-form
              :model="passwordForm"
              :rules="passwordRules"
              ref="passwordFormRef"
            >
              <el-form-item label="原密码" prop="oldPassword">
                <el-input
                  v-model="passwordForm.oldPassword"
                  style="width: 213px"
                  type="password"
                />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="passwordForm.newPassword"
                  style="width: 213px"
                  type="password"
                />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  style="width: 200px"
                  type="password"
                />
              </el-form-item>
            </el-form>
          </div>
          <el-button
            type="primary"
            @click="updatePassword"
            style="width: 200px; margin: 20px 280px"
            >确认修改</el-button
          >
        </template>
        <!-- 我的文件 -->
        <template v-if="activeTab === '我的文件'">
          <div class="file-head">
            <text style="font-size: 24px; font-weight: bold; margin-left: 60px"
              >我的文件</text
            >
            <div class="btn-group">
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
            </div>
            <el-upload
              :before-upload="handleFile"
              :on-success="uploadFileSuc"
              :limit="1"
              :on-exceed="handleExceed"
              class="upload-file"
            >
              <template #trigger>
                <el-button type="primary">上传文件</el-button>
              </template>
            </el-upload>
            <el-input
              class="search-bar"
              placeholder="搜索文件"
              v-model="userSearchTerm"
              :disabled="loading"
              @keydown.enter="searchItem"
            >
              <template #append>
                <el-button :icon="Search" @click="searchItem" />
              </template>
            </el-input>
          </div>
          <el-table :data="userFiles" style="width: 100%; margin-top: 20px">
            <el-table-column prop="fileName" label="文件名" />
            <el-table-column prop="fileSize" label="文件大小" />
            <el-table-column prop="createTime" label="创建时间" />
          </el-table>
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
        </template>
      </el-main>
    </el-container>
  </div>
  <Footer />
</template>  

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import {
  updateUserInfoService,
  updateUserPasswordService,
  getUserInfoService,
  getUserFiles,
} from "../api/user";
import { formatDate } from "@/utils/TimeFromUtil";
import Footer from "@/components/headFoot/Footer.vue";
import { User, Lock, Upload, Search } from "@element-plus/icons-vue";
import { uploadFileService } from "@/api/file";

const userForm = ref({
  headImg: "",
  name: "",
  phone: "",
});

const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const rules = {
  headImg: [{ required: true, message: "请上传头像", trigger: "blur" }],
  phone: [
    {
      pattern: /^[0-9]{11}$/,
      message: "手机号必须为11位数字",
      trigger: "blur",
    },
  ],
};

const passwordRules = {
  oldPassword: [
    { required: true, message: "请输入原密码", trigger: "blur" },
    {
      pattern: /^[^\s]{6,16}$/,
      message: "密码长度为6-16位",
      trigger: "blur",
    },
  ],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const activeTab = ref("基本信息");
const activeTabColor = {
  backgroundColor: "#ecf5ff",
};
const userInfo = ref([{}]);
const initialUserInfo = ref({});

onMounted(async () => {
  await getUserInfo();
  await fetchFiles();
});

const isFormModified = computed(() => {
  return (
    userForm.value.name !== initialUserInfo.value.name ||
    userForm.value.phone !== initialUserInfo.value.phone ||
    userForm.value.headImg !== initialUserInfo.value.headImg
  );
});

const handleAvatarSuccess = () => {
  console.log("上传成功");
};

const handleUpload = async (file) => {
  try {
    const response = await uploadFileService(file);
    if (response.data && response.data.fileUrl) {
      userForm.value.headImg = response.data.fileUrl;
      console.log("上传成功：", userForm.value.headImg);
    }
  } catch (error) {
    ElMessage.error("文件上传失败，请重试！");
  }
  return false;
};

const handleAvatarError = (err, file) => {
  console.error("Upload failed:", err);
};

const saveUserInfo = async () => {
  const userInfo = {
    name: userForm.value.name || "",
    phone: userForm.value.phone || "",
    headImg: userForm.value.headImg || "",
  };

  try {
    const res = await updateUserInfoService(userInfo);
    if (res) {
      ElMessage.success("修改成功！");
      await getUserInfo();
    } else {
      ElMessage.error(res.message);
      console.log(res);
    }
  } catch (error) {
    ElMessage.error("请求失败，请稍后重试。");
  }
};

const getUserInfo = async () => {
  const data = await getUserInfoService();
  userForm.value.username = data.username;
  userForm.value.phone = data.phone;
  userForm.value.email = data.email;
  userForm.value.name = data.name;
  userForm.value.headImg = data.headImg;
  initialUserInfo.value = { ...data };
  userInfo.value = data;
  userInfo.value.createdTime = formatDate(data.createdTime);
};

const updatePassword = async () => {
  const form = {
    oldPassword: passwordForm.value.oldPassword,
    newPassword: passwordForm.value.newPassword,
  };
  try {
    const res = await updateUserPasswordService(form);
    if (res.code === "0") {
      ElMessage.success("修改成功！");
      passwordForm.value.oldPassword = "";
      passwordForm.value.newPassword = "";
      passwordForm.value.confirmPassword = "";
    } else {
      ElMessage.error(res.data);
    }
  } catch (err) {
    ElMessage.error(err.data);
  }
};
const handleFile = async (file) => {
  try {
    const response = await uploadFileService(file);
    if (response.data && response.data.fileUrl) {
      console.log("上传成功", response.data.fileUrl);
    }
  } catch (error) {
    ElMessage.error("文件上传失败，请重试！");
  }
  return false;
};

// 获取文件逻辑
const files = ref([]);
const totalFiles = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const selectedFileType = ref("PPTX");
// 文件类型映射
const getSelectedFileTypes = () => {
  const typeMap = {
    // 文件类型映射（适配后端枚举）
    全部: ["WAV", "DOC", "DOCX", "PDF", "PPT", "PPTX", "PNG", "JPG", "ZIP"],
    PPT: ["PPT", "PPTX"],
    音频: ["WAV"],
    图片: ["PNG", "JPG"],
    文档: ["DOC", "DOCX", "PDF"],
    压缩包: ["ZIP"],
  };
  return typeMap[userActiveButton.value] || []; // 返回对应文件类型
};
const userFiles = ref([]);
const userButtonList = ref(["音频", "文档", "图片", "PPT"]);
const userActiveButton = ref("音频");
const userActiveStyle = {
  backgroundColor: "#409EFF", // 活动状态的背景色
  color: "#fff", // 活动状态的字体颜色
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
const userCurrentPage = ref(1);
const userPageSize = ref(5);
const userTotalFiles = ref(0);
const userTotalPages = ref(0);
const userSelectedFileTypes = ref([]); // 存储选中的文件类型

const userSearchTerm = ref("");
// 获取文件列表的函数
const fetchUserFiles = async () => {
  const userPageDTO = {
    fileTypes: getSelectedFileTypes(),
    fileName: searchQuery.value,
    pageNum: userCurrentPage.value,
    pageSize: userPageSize.value,
  };

  try {
    loading.value = true; // 开始加载
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
  } finally {
    loading.value = false; // 结束加载
  }
};
const searchQuery = ref("");
// 点击搜索图标时调用搜索函数
const searchItem = () => {
  searchQuery.value = userSearchTerm.value;
  userCurrentPage.value = 1; // 重置为第一页
  fetchUserFiles(); // 调用获取文件的函数
};
const loading = ref(false);

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
const fetchFiles = async () => {
  const form = {
    fileTypes: selectedFileType.value ? [selectedFileType.value] : [],
    fileName: userSearchTerm.value,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  };

  try {
    const res = await getUserFiles(form);
    if (res.code == 0) {
      files.value = res.data.records;
      totalFiles.value = res.data.total;
    } else {
      ElMessage.error(res.message || "获取失败");
    }
  } catch (error) {
    ElMessage.error("请求失败，请稍后重试。");
  }
};
// 监听文件类型和搜索条件的变化
watch([userSelectedFileTypes, userSearchTerm], () => {
  userCurrentPage.value = 1; // 重置为第一页
  fetchUserFiles(); // 重新获取文件
});
</script> 

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin-bottom: 30px;
}
.header {
  width: 1080px;
  height: 160px;
  margin: 30px auto;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
  overflow: hidden; /* 确保内容不超出边界 */
  position: relative;
}
.header::before {
  content: "";
  top: 40%;
  left: 50%;
  width: 1000px;
  height: 80px;
  background: linear-gradient(135deg, #3fa4fa, #36cfdd);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  z-index: 0;
}
.header .avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 15px 60px;
  background-color: #fff;
  border: 1px solid #fff;
  position: relative;
  z-index: 1;
}
.header .under-avatar {
  width: 100%;
  display: flex;
  padding: 0 20px;
}
.header .left {
  display: flex;
  flex-direction: row;
  flex: 3;
  padding-left: 50px;
}
.header .upload-btn {
  flex: 0.6;
}
.header .username {
  color: black;
  font-size: 22px;
}
.header .id {
  margin-left: 20px;
  margin-top: 5px;
  color: #909399;
}
.header .registration-date {
  margin-left: 20px;
  margin-top: 5px;
  color: #909399;
}
.aside {
  width: 250px;
  height: 168px;
  margin-right: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.main {
  width: 800px;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.info-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
}
.info-form .center {
  padding: 10px 10px;
  height: 100px;
  width: 610px;
  border-style: solid;
  border-width: 1px 0 1px 0;
  border-color: #e8e8e8;
}
.info-form .left {
  float: left;
}
.info-form .right {
  margin-left: 100px;
  float: right;
}
.password-form {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  margin-left: 60px;
  width: 610px;
  border-style: solid;
  border-width: 1px 0 1px 0;
  padding-top: 10px;
  border-color: #e8e8e8;
}
.file-head {
  display: flex;
  flex-direction: row;
}
.btn-group {
  margin-left: 10px;
  display: flex;
}
.file-head .search-bar {
  height: 34px;
  width: 150px;
  margin-left: 20px;
}
.file-head .upload-file {
  margin-left: 20px;
}

.page-btns {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>