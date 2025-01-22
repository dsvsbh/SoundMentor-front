<template>
  <div class="container">
    <!-- 基本信息 -->
    <div class="header">
      <div class="title">
        <div class="title-left">
          <text style="font-size: 30px; font-weight: 600; margin-right: 20px">{{
            group.name
          }}</text>
          <el-tag :type="getTagType(currentRole)" size="default">
            {{ roleLabels[currentRole] }}
          </el-tag>
        </div>
        <template v-if="currentRole === 2">
          <el-button type="primary" :icon="Setting">组织管理</el-button>
        </template>
        <template v-else>
          <el-button type="primary" :icon="Setting" disabled
            >组织管理</el-button
          >
        </template>
      </div>
      <!-- 组织信息 -->
      <div class="group-info">
        <div class="info-item">
          <el-icon style="margin-right: 5px" color="#409eff"><User /></el-icon>
          <text>{{ group.userCount }}个成员</text>
        </div>
        <div class="info-item">
          <el-icon style="margin-right: 5px" color="#409eff"><Files /></el-icon>
          <text>{{ group.fileCount }}个文件</text>
        </div>
        <div class="info-item">
          <el-icon style="margin-right: 5px" color="#409eff"
            ><Calendar
          /></el-icon>
          <text>创建于{{ group.createdTime }}</text>
        </div>
      </div>
    </div>
    <!-- 共享文件 -->
    <div class="share-files">
      <text style="font-size: 20px"> 共享文件 </text>
      <!-- 按钮 -->
      <div class="btns">
        <div class="left-btns">
          <el-button
            v-for="(button, index) in buttonList"
            :key="index"
            :style="activeButton === button ? activeStyle : {}"
            @click="filterFiles(button)"
          >
            {{ button }}
          </el-button>
        </div>
        <div class="right-btns">
          <el-input
            placeholder="搜索文件"
            style="width: 200px; height: 33px"
            v-model="searchQuery"
            ><template #prepend> <el-button :icon="Search" /> </template
          ></el-input>
          <el-button
            type="primary"
            :icon="UploadFilled"
            @click="isUploadVisible = !isUploadVisible"
            >上传文件</el-button
          >
          <UploadFiles v-model="isUploadVisible" />
        </div>
      </div>
      <div class="file-list">
        <template v-if="paginatedFiles.length == 0">
          <div style="padding: 0 355px">
            <el-empty
              description="组织文件为空，快去上传吧"
              style="width: 200px"
            >
            </el-empty>
          </div>
        </template>
        <div class="file-item" v-for="file in paginatedFiles" :key="file.id">
          <img src="" alt="" class="ppt-first-page" />
          <!-- 文件展示 -->

          <div class="info">
            <div class="under-img">
              <text style="font-size: 16px; font-weight: 600">{{
                file.name
              }}</text>
              <el-icon><InfoFilled /></el-icon>
            </div>
            <!-- 文件信息 -->
            <div class="file-info">
              <el-icon><Document /></el-icon>
              <text>{{ file.size }}页</text>
              <el-icon><Download /></el-icon>
              <text>{{ file.downloadCount }}次</text>
            </div>
            <!-- 成员信息 -->
            <div class="member-info">
              <div class="left-info">
                <img :src="file.memberImage" alt="" class="member-img" />
                <text>{{ file.memberName }}</text>
              </div>
              <div class="right-info">
                <el-tag :type="getTagType(file.memberRole)">{{
                  roleLabels[file.memberRole]
                }}</el-tag>
              </div>
            </div>
            <!-- 操作 -->
            <div class="card-foot">
              <text>点击修改/查看对文件</text>
              <el-icon><Download /></el-icon>
              <el-icon><Delete /></el-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="page-btns">
        <el-button-group>
          <el-button @click="prevPage" :disabled="currentPage === 1"
            >上一页</el-button
          >
          <el-button
            v-for="page in pagination"
            :key="page"
            @click="setPage(page)"
          >
            {{ page }}
          </el-button>
          <el-button @click="nextPage" :disabled="currentPage === totalPages"
            >下一页</el-button
          >
        </el-button-group>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import {
  getOrganizationMemberListService,
  getGroupFiles,
} from "../../api/group";
import { ElMessage } from "element-plus";
import Footer from "@/components/headFoot/Footer.vue";
import UploadFiles from "@/components/group/UploadFiles.vue";
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
import { useRouter } from "vue-router";

const router = useRouter();
const organizationId = ref(router.currentRoute.value.params.id); //组织id
const group = ref(
  JSON.parse(decodeURIComponent(router.currentRoute.value.query.group))
); //组织信息
const members = ref([]); //组员信息
const roleLabels = {
  0: "普通成员",
  1: "组织管理员",
  2: "组织创建者",
};
onMounted(async () => {
  members.value = await getOrganizationMemberListService(organizationId.value);
  getCurrentRole();
});

// 获取当前用户角色
const currentRole = ref(0);
const getCurrentRole = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  for (const member of members.value) {
    if (member.name === userInfo.name) {
      currentRole.value = member.organizationRole;
    }
  }
};

// 获取标签类型
const getTagType = (role) => {
  switch (role) {
    case 0:
      return "info"; //普通成员
    case 1:
      return "warning"; // 组织管理员
    case 2:
      return "danger"; //组织创建者
  }
};

let isUploadVisible = ref(false);
// 上传用户文件至组织
const upload = (file) => {
  isUploadVisible = !isUploadVisible;
  console.log(11111);
};

// 文件过滤
const buttonList = ["全部", "PPT", "音频", "图片", "文档"]; // 筛选按钮列表
const activeButton = ref("全部"); // 当前激活的筛选按钮
const activeStyle = {
  backgroundColor: "#409EFF",
  color: "#fff",
};
const itemsPerPage = ref(6); // 每页显示的文件条数
const currentPage = ref(1); // 当前页面
const searchQuery = ref(""); // 搜索查询内容
const files = ref([]); // 用于存储从API获取的文件记录
const totalPages = ref(0); // 存储总页数

// 在组件挂载时获取组员信息并初始化文件
onMounted(async () => {
  members.value = await getOrganizationMemberListService(organizationId.value); // 获取组员列表
  getCurrentRole(); // 获取当前用户角色
  fetchFiles(); // 初始获取文件
});

// 根据当前筛选条件和分页请求文件
const fetchFiles = async () => {
  const orgId = parseInt(organizationId.value, 10);

  // 构建请求参数
  const formData = {
    organizationId: orgId,
    fileTypes: getSelectedFileTypes(),
    fileName: searchQuery.value,
    pageNum: currentPage.value,
    pageSize: itemsPerPage.value,
  };

  try {
    const response = await getGroupFiles(formData);
    if (response.code == "0") {
      files.value = response.data.records;
      totalPages.value = response.data.pages; // 更新总页数
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error("获取文件时出错");
  }
};

// 根据当前激活的按钮获取选中的文件类型
const getSelectedFileTypes = () => {
  const typeMap = {
    // 文件类型映射
    全部: ["MP3", "DOC", "DOCX", "PDF", "PPTX", "PNG", "JPG"],
    PPT: ["PPTX"],
    音频: ["MP3"],
    图片: ["PNG", "JPG"],
    文档: ["DOC", "DOCX", "PDF"],
  };
  return typeMap[activeButton.value] || []; // 返回对应文件类型
};

// 监听搜索框、激活按钮和当前页码的变化，重新获取文件
watch([searchQuery, activeButton, currentPage], fetchFiles);

// 计算当前页面显示的文件
const paginatedFiles = computed(() => {
  return files.value.slice(
    (currentPage.value - 1) * itemsPerPage.value,
    currentPage.value * itemsPerPage.value
  );
});

// 获取分页按钮
const pagination = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages.length > 3
    ? [...pages.slice(0, 3), "...", pages[pages.length - 1]]
    : pages;
});

// 设置当前页面
const setPage = (page) => {
  if (page !== "...") {
    currentPage.value = page;
  }
};

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

// 监听搜索查询变化，重置页码到第一页
watch(searchQuery, () => {
  currentPage.value = 1;
});

// 监听活动按钮变化，重置页码到第一页
watch(activeButton, () => {
  currentPage.value = 1;
});

// 过滤文件
const filterFiles = (button) => {
  activeButton.value = button;
};
</script>
<style scoped>
.container {
  padding: 20px 50px;
  margin: 0 auto;
  width: 950px;
}
.header {
  background: linear-gradient(to right, #f9fcfe, #edf6fd);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.group-info {
  display: flex;
  justify-content: space-between;
  width: 50%;
  margin-bottom: 5px;
}
.info-item {
  background-color: #eaf4fe;
  width: auto;
  padding: 10px 20px;
  border-radius: 10px;
}
.share-files {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.share-files .btns {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e6e6e6;
}
.right-btns {
  display: flex;
  gap: 10px;
}
.share-files .file-list {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.file-item {
  border: 1px solid #e6e6e6;
  border-radius: 10px;
}
.file-item .ppt-first-page {
  width: 100%;
  height: 200px;
  background-color: #f2f2f2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.file-item .info {
  padding: 10px;
}
.under-img {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.file-item .info .file-info {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #9a9ca2;
}
.file-item .info .member-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  height: 50px;
}
.file-item .info .member-info .member-img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f2f2f2;
  margin-right: 10px;
}
.file-item .info .card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 16px;
  color: #31a8ff;
  height: 30px;
}
.page-btns {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.user-file-list {
  gap: 10px;
}
.file-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
