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
            style="width: 200px"
            v-model="searchQuery"
            ><template #prepend> <el-button :icon="Search" /> </template
          ></el-input>
          <el-button type="primary" :icon="UploadFilled">上传文件</el-button>
        </div>
      </div>
      <div class="file-list">
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
</template>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { getOrganizationMemberListService } from "../api/group";
import { ElMessage } from "element-plus";
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
  console.log(group.value);
  members.value = await getOrganizationMemberListService(organizationId.value);
  getCurrentRole();
});

// 获取当前用户角色
const currentRole = ref(0);
const getCurrentRole = () => {
  console.log(members.value);
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

// 文件过滤
const buttonList = ["全部", "PPT", "音频", "图片"];
const activeButton = ref("全部");
const activeStyle = {
  backgroundColor: "#409EFF",
  color: "#fff",
};
// 分页相关变量
const itemsPerPage = 6;
const currentPage = ref(1);
// 搜索查询
const searchQuery = ref("");
// 计算筛选后的文件列表
const filteredFiles = computed(() => {
  let result = files.value;

  // 根据搜索条件过滤文件
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((file) => file.name.toLowerCase().includes(query));
  }

  // 根据活动按钮过滤文件类型
  if (activeButton.value !== "全部") {
    result = result.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (activeButton.value === "PPT") {
        return fileExtension === "ppt" || fileExtension === "pptx";
      } else if (activeButton.value === "音频") {
        return fileExtension === "mp3" || fileExtension === "wav";
      } else if (activeButton.value === "图片") {
        return ["jpg", "jpeg", "png", "gif"].includes(fileExtension);
      }
      return false; // 默认不匹配
    });
  }

  return result;
});

// 计算总页数
const totalPages = computed(() =>
  Math.ceil(filteredFiles.value.length / itemsPerPage)
);

// 获取当前页的文件
const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredFiles.value.slice(start, start + itemsPerPage);
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

// 获取文件列表
const files = ref([
  {
    id: 1,
    name: "项目计划.docx",
    size: 5,
    downloadCount: 12,
    memberName: "张三",
    memberRole: 1,
    imageUrl: "https://via.placeholder.com/150",
    memberImage: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "产品展示.pptx",
    size: 10,
    downloadCount: 8,
    memberName: "李四",
    memberRole: 0,
    imageUrl: "https://via.placeholder.com/150",
    memberImage: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "市场分析.pdf",
    size: 4,
    downloadCount: 5,
    memberName: "王五",
    memberRole: 2,
    imageUrl: "https://via.placeholder.com/150",
    memberImage: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "预算报告.xlsx",
    size: 3,
    downloadCount: 10,
    memberName: "赵六",
    memberRole: 1,
    imageUrl: "https://via.placeholder.com/150",
    memberImage: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    name: "会议记录.txt",
    size: 2,
    downloadCount: 15,
    memberName: "钱七",
    memberRole: 0,
    imageUrl: "https://via.placeholder.com/150",
    memberImage: "https://via.placeholder.com/150",
  },
  {
    id: 6,
    name: "设计草图.ai",
    size: 8,
    downloadCount: 20,
    memberName: "孙八",
    memberRole: 1,
    imageUrl: "https://via.placeholder.com/150",
    memberImage: "https://via.placeholder.com/150",
  },
  {
    id: 7,
    name: "用户反馈.docx",
    size: 6,
    downloadCount: 13,
    memberName: "周九",
    memberRole: 0,
    imageUrl: "https://via.placeholder.com/150",
    memberImage: "https://via.placeholder.com/150",
  },
  {
    id: 8,
    name: "测试报告.pdf",
    size: 4,
    downloadCount: 9,
    memberName: "吴十",
    memberRole: 2,
    imageUrl: "https://via.placeholder.com/150",
    memberImage: "https://via.placeholder.com/150",
  },
  {
    id: 9,
    name: "开发文档.doc",
    size: 5,
    downloadCount: 7,
    memberName: "郑十一",
    memberRole: 1,
    imageUrl: "https://via.placeholder.com/150",
    memberImage: "https://via.placeholder.com/150",
  },
  {
    id: 10,
    name: "数据分析.xlsx",
    size: 3,
    downloadCount: 11,
    memberName: "冯十二",
    memberRole: 0,
    imageUrl: "https://via.placeholder.com/150",
    memberImage: "https://via.placeholder.com/150",
  },
]);
</script>
<style scoped>
.container {
  padding: 20px 50px;
  margin: 0 auto;
  width: 950px;
  margin-bottom: 40px;
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
</style>
