<template>
  <div class="container">
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <text style="font-size: 22px">成员管理</text>
      <el-button type="danger" @click="handleDeleteGroup">解散组织</el-button>
    </div>
    <el-table :data="members">
      <el-table-column prop="headImg" label="头像">
        <template #default="scope">
          <img
            :src="
              scope.row.headImg == 'default'
                ? './src/assets/logo.png'
                : scope.row.headImg
            "
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
      <el-table-column prop="organizationRole" label="角色">
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.organizationRole)" size="default">
            {{ roleLabels[scope.row.organizationRole] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            @click="handleEdit(scope.row)"
            v-if="scope.row.organizationRole !== 2"
            >修改</el-button
          >
          <el-button
            type="danger"
            @click="handleDelete(scope.row)"
            v-if="scope.row.organizationRole !== 2"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 解散会话 -->
    <el-dialog title="确定要解散组织吗？" v-model="isDelete" width="30%">
      <span class="dialog-footer">
        <el-button @click="isDelete = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确认</el-button>
      </span>
    </el-dialog>
    <!-- 修改会话 -->
    <el-dialog title="选择角色" v-model="visible" width="30%">
      <el-select
        v-model="selectedRole"
        placeholder="请选择角色"
        style="margin-bottom: 20px"
      >
        <el-option label="组织管理员" value="ADMIN"></el-option>
        <el-option label="普通成员" value="USER"></el-option>
      </el-select>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdate">确认</el-button>
      </span>
    </el-dialog>
    <!-- 踢出会话 -->
    <el-dialog title="确定要踢出用户吗？" v-model="isKick" width="30%">
      <span class="dialog-footer">
        <el-button @click="isKick = false">取消</el-button>
        <el-button type="danger" @click="confirmKick">确认</el-button>
      </span>
    </el-dialog>
  </div>
  <Footer />
</template>  

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  getOrganizationMemberListService,
  deleteOrganizationService,
  kickUserService,
} from "@/api/group";
import { updateUserRoleService } from "@/api/group";
import Footer from "@/components/headFoot/Footer.vue";
import { useRouter } from "vue-router";

const visible = ref(false);
const isDelete = ref(false);
const isKick = ref(false);
const selectedRole = ref("普通成员");
const members = ref([]);
const selectedRow = ref(null);

const roleLabels = {
  0: "普通成员",
  1: "组织管理员",
  2: "组织创建者",
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
const router = useRouter();
const organizationId = Number(router.currentRoute.value.params.id);

onMounted(async () => {
  fetchMembers();
});

const fetchMembers = async () => {
  const res = await getOrganizationMemberListService(organizationId);
  members.value = res;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10);
};

const handleEdit = (row) => {
  visible.value = true;
  selectedRow.value = row;
  selectedRole.value = roleLabels[row.organizationRole];
};

const handleDeleteGroup = async () => {
  isDelete.value = true;
};

const confirmDelete = async () => {
  try {
    const res = await deleteOrganizationService(organizationId);
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

const handleDelete = (row) => {
  selectedRow.value = row;
  isKick.value = true;
};

const confirmKick = async () => {
  if (!selectedRow.value) {
    ElMessage.error("未选择用户");
    return;
  }

  const data = {
    organizationId,
    userId: selectedRow.value.userId,
  };
  console.log(data);
  try {
    const res = await kickUserService(data);
    if (res.code == 0) {
      ElMessage.success("踢出成功！");
      isKick.value = false;
      fetchMembers();
    }
  } catch (error) {
    ElMessage.error(error.message);
    return;
  }
};

const confirmUpdate = async () => {
  if (!selectedRole.value) {
    ElMessage.error("请选择角色");
    return;
  }

  const data = {
    organizationId,
    userId: selectedRow.value.userId,
    role: selectedRole.value,
  };

  try {
    const result = await updateUserRoleService(data);
    if (result.code === "0") {
      console.log("角色更新成功", result);
      ElMessage.success("角色更新成功");
      visible.value = false;
      fetchMembers();
    }
  } catch (error) {
    console.error("更新用户角色时出错", error);
    ElMessage.error("更新失败，请重试");
  }
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
.dialog-footer {
  margin: 0 138px;
}
</style>

