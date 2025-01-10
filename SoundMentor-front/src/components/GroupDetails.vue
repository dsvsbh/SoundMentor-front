<template>
  <div class="container">
    <text style="font-size: 22px">成员管理</text>
    <el-table :data="members">
      <el-table-column prop="headImg" label="头像">
        <template #default="scope">
          <img
            :src="scope.row.headImg || './src/assets/logo.png'"
            style="width: 50px; height: 50px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="entryTime" label="加入时间">
        <template #default="scope">
          <span>{{ formatDate(scope.row.entryTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orgnizationRole" label="角色">
        <template #default="scope">
          <el-tag type="primary" size="default">
            {{ roleLabels[scope.row.organizationRole] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getOrganizationMemberListService } from "@/api/user";

export default {
  name: "GroupDetails",
  setup() {
    return {
      organizationId: "",
    };
  },
  data() {
    return {
      members: [],
      roleLabels: {
        0: "普通成员",
        1: "组织管理员",
        2: "组织创建者",
      },
    };
  },
  async mounted() {
    const res = await getOrganizationMemberListService(this.$route.params.id);
    this.members = res;
  },

  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 10);
    },
    handleEdit(row) {
      console.log(row);
    },
    handleDelete(row) {
      console.log(row);
    },
  },
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
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
</style>

