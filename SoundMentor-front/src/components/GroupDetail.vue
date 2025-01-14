<template>
  <div class="container">
    <!-- 基本信息 -->
    <div class="header">
      <div class="title">
        <text>{{ group.name }}</text>
        <el-tag type="primary" size="default">
          {{ roleLabels[currentRole] }}
        </el-tag>
        <el-button type="primary" :icon="Setting">组织管理</el-button>
      </div>
      <div class="group-info">
        <div class="capacity">
          <el-icon><User /></el-icon>
          <text>{{ group.userCount }}</text>
        </div>
        <div class="files">
          <el-icon><Files /></el-icon>
          <text>{{ group.fileCount }}</text>
        </div>
        <div class="time">
          <el-icon><Calendar /></el-icon>
          <text>{{ group.createdTime }}</text>
        </div>
      </div>
    </div>
    <div class="share-files">
      <text>共享文件</text>
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
            prefix-icon="el-icon-search"
          ></el-input>
          <el-button type="primary" :icon="UploadFilled">上传文件</el-button>
        </div>
      </div>
      div
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getOrganizationMemberListService } from "../api/group";
import { ElMessage } from "element-plus";
import { User, Files, Calendar, UploadFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const organizationId = ref(router.currentRoute.value.params.id); //组织id
const group = ref(router.currentRoute.value.query.group); //组织信息
const members = ref([]); //组员信息
const roleLabels = {
  0: "普通成员",
  1: "组织管理员",
  2: "组织创建者",
};
onMounted(async () => {
  console.log(group.value);
  const res = await getOrganizationMemberListService(organizationId.value);
  getCurrentRole();
  members.value = res;
  console.log(members.value);
});

// 获取当前用户角色
const currentRole = ref("");
const getCurrentRole = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  console.log(userInfo);
  for (const member of members.value) {
    if (member.name == userInfo.name) {
      currentRole.value = member.organizationRole;
      console.log(currentRole.value);
    } else {
      console.log(0);
    }
  }
};

// 文件过滤
const buttonList = ["全部", "PPT", "音频", "图片"];
const activeButton = ref("全部");
const activeStyle = {
  backgroundColor: "#409EFF",
  color: "#fff",
};
const filterFiles = (button) => {
  activeButton.value = button;
};
</script>
<style scoped>
.container {
  padding: 50px 50px;
  margin: 0 auto;
  width: 1300px;
  background-color: #ffffff;
  margin-top: 40px;
  margin-bottom: 40px;
}
</style>
