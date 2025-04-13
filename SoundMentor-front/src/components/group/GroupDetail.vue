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
          <el-button
            type="primary"
            :icon="Setting"
            @click="isControlVisible = !isControlVisible"
            >组织管理</el-button
          >
          <el-dialog v-model="isControlVisible" title="组织管理" width="30%">
            <div class="list-box">
              <div
                v-for="item in funcList"
                :key="item.title"
                style="
                  display: flex;
                  margin: 10px 0;
                  border-top: 1px solid #e9e9e9;
                  padding-top: 10px;
                "
              >
                <el-icon style="flex: 0.5; color: #58aaff" size="30">
                  <component :is="item.icon" />
                </el-icon>
                <div
                  @click="item.handleClick"
                  style="
                    display: flex;
                    flex-direction: column;
                    flex: 3;
                    gap: 6px;
                    margin-left: 10px;
                  "
                >
                  <text style="font-weight: bold">{{ item.title }}</text>
                  <text style="font-size: 12px">{{ item.info }}</text>
                </div>
              </div>
            </div>
          </el-dialog>
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
            @keydown.enter="handleSearch"
          >
            <template #prepend>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>

          <el-button
            type="primary"
            :icon="UploadFilled"
            @click="handleUploadClick"
            :disabled="currentRole === 0"
            >上传文件</el-button
          >
          <UploadFiles
            v-model="isUploadVisible"
            :organizationId="organizationId"
          />
        </div>
      </div>
      <div class="file-list">
        <template v-if="paginatedFiles.length == 0">
          <div style="padding: 0 355px">
            <el-empty description="文件为空，快去上传吧" style="width: 200px">
            </el-empty>
          </div>
        </template>
        <div class="file-item" v-for="file in paginatedFiles" :key="file.id">
          <img :src="file.filePath" alt="" class="ppt-first-page" />
          <!-- 文件展示 -->

          <div class="info">
            <div class="under-img">
              <text style="font-size: 16px; font-weight: 600">{{
                file.fileName
              }}</text>
              <!-- TODO 文件信息-->
              <el-icon v-if="currentRole !== 0" @click="updateFileInfo"
                ><InfoFilled
              /></el-icon>
            </div>
            <!-- 文件信息 -->
            <div class="file-info">
              <el-icon><Document /></el-icon>
              <text>{{ file.fileSize }}MB</text>
              <el-icon><Download /></el-icon>
              <text>{{ file.downloadCount }}次下载</text>
              <text>上传于{{ file.createTime }}</text>
            </div>
            <!-- 成员信息 -->
            <div class="member-info">
              <div class="left-info">
                <img :src="file.sharerHeaderImg" alt="" class="member-img" />
                <text>{{ file.sharerName }}</text>
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
              <el-icon @click="downloadFile(file)"><Download /></el-icon>
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
  <el-dialog
    title="确定要解散组织吗？"
    v-model="isDelete"
    width="30%"
    style="margin-top: 200px"
  >
    <span class="dialog-footer">
      <el-button @click="isDelete = false">取消</el-button>
      <el-button type="danger" @click="confirmDelete">确认</el-button>
    </span>
  </el-dialog>
  <Footer />
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import {
  getOrganizationMemberListService,
  getGroupFiles,
  getOrganizationShareCodeService,
  deleteOrganizationService,
  getDownloadCounts,
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
  Share,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { formatDate } from "@/utils/TimeFromUtil";

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
const handleUploadClick = () => {
  isUploadVisible = !isUploadVisible;
  fetchFiles();
};

// 文件过滤
const buttonList = ["全部", "PPT", "音频", "图片", "文档"]; // 筛选按钮列表
const activeButton = ref("全部"); // 当前激活的筛选按钮
const activeStyle = {
  backgroundColor: "#409EFF",
  color: "#fff",
};
const itemsPerPage = ref(6);
const currentPage = ref(1);
const searchQuery = ref("");
const files = ref([]);
const totalPages = ref(0);

// 在组件挂载时获取组员信息并初始化文件
onMounted(async () => {
  members.value = await getOrganizationMemberListService(organizationId.value);
  getCurrentRole();
  fetchFiles();
});
// 文件名格式化函数
const formatFileName = (fileName) => {
  const maxLength = 10; // 最大长度
  return fileName && fileName.length > maxLength
    ? `${fileName.slice(0, maxLength)}...`
    : fileName || "未知文件";
};

// 处理搜索按钮点击事件
const searchTerm = ref("");
const handleSearch = () => {
  searchTerm.value = searchQuery.value;
  currentPage.value = 1;
  fetchFiles();
};
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
      files.value = response.data.records.map((file) => ({
        ...file,
        fileName: formatFileName(file.fileName),
        fileSize: (file.fileSize / 1024 / 1024).toFixed(2),
        createTime: formatDate(file.createTime),
        memberRole: getUploadUserRole(file),
      }));
      const isEqual = (arr1, arr2) => {
        return (
          arr1.length === arr2.length &&
          arr1.every((value, index) => value === arr2[index])
        );
      };

      if (
        isEqual(formData.fileTypes, [
          "MP3",
          "DOC",
          "DOCX",
          "PDF",
          "PPTX",
          "PNG",
          "JPG",
        ])
      ) {
        group.value.fileCount = response.data.total;
      }
      totalPages.value = response.data.pages; // 更新总页数
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error("获取文件时出错");
  }
};

// 获取上传用户的角色
const getUploadUserRole = (file) => {
  const member = members.value.find(
    (member) => member.name === file.sharerName
  );
  return member ? member.organizationRole : null;
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
watch([activeButton, currentPage], fetchFiles);

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

// 监听活动按钮变化，重置页码到第一页
watch(activeButton, () => {
  currentPage.value = 1;
});

// 过滤文件
const filterFiles = (button) => {
  activeButton.value = button;
};

// 下载文件
const downloadFile = (file) => {
  const link = document.createElement("a");
  link.href = file.filePath;
  link.download = "";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  const form = {
    organizationId: organizationId.value,
    fileId: file.fileId,
  };
  getDownloadCounts(form);
};

// ==========组织管理==========
const isDelete = ref(false);

// 获取邀请码
const getShareCode = async (id) => {
  try {
    const res = await getOrganizationShareCodeService(id);
    if (res) {
      const shareCode = `${id}-${res}`;
      await navigator.clipboard.writeText(shareCode); // 复制到剪贴板
      ElMessage.success(`已复制邀请码：${shareCode}`);
    } else {
      ElMessage.error(res.message || "获取邀请码失败");
    }
  } catch (error) {
    console.error("获取组织邀请码时出错：", error);
    ElMessage.error("获取组织邀请码失败，请稍后再试。");
  }
};

// 解散组织
const handleDeleteGroup = async () => {
  isDelete.value = true;
};

// 确认删除
const confirmDelete = async () => {
  try {
    const res = await deleteOrganizationService(organizationId.value);
    if (res.code == 0) {
      ElMessage.success("解散成功！");
      isDelete.value = false;
      window.location.reload();
    }
  } catch (error) {
    ElMessage.error("解散失败！");
    window.location.reload();
  }
};

// 功能列表
const funcList = [
  {
    title: "成员管理",
    info: "管理组织成员和权限",
    icon: User,
    handleClick: () => {
      const id = organizationId.value;
      router.push({
        path: `/groupMembers/${id}`,
      });
    },
  },
  {
    title: "邀请码",
    info: "获取组织邀请码",
    icon: Share,
    handleClick: () => {
      getShareCode(organizationId.value);
    },
  },
  {
    title: "解散组织",
    info: "永久删除该组织及其所有数据",
    icon: Delete,
    handleClick: handleDeleteGroup,
  },
];
const isControlVisible = ref(false);
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
  flex-direction: column;
  width: 100%;
}
.file-item .ppt-first-page {
  width: 100%;
  height: 200px;
  background-color: #f2f2f2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.file-item .info {
  width: 260px;
  padding: 10px 0;
}
.under-img {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.file-item .info .file-info {
  display: flex;
  gap: 5px;
  color: #9a9ca2;
  font-size: 12px;
}
.file-item .info .member-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  height: 50px;
}
.file-item .info .member-info .member-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f2f2f2;
  margin-right: 10px;
}
.file-item .info .card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 13px;
  color: #31a8ff;
  height: 30px;
  border-top: 1px solid #e9e9e9;
  padding-top: 10px;
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
.dialog-footer {
  margin: 0 135px;
}
</style>
