<template>
  <div class="group-view">
    <div class="group-view-header" style="margin-left: 30px">
      <div class="group-view-header-title">
        <text style="font-size: 30px; font-weight: bold">我的组织</text>
        <div class="bar"></div>
      </div>
      <el-button-group>
        <el-button
          :icon="Menu"
          :style="activeButton === '全部组织' ? activeStyle : {}"
          @click="filterGroups('全部组织')"
          >全部组织</el-button
        >

        <el-button
          :icon="Flag"
          :style="activeButton === '我创建的' ? activeStyle : {}"
          @click="filterGroups('我创建的')"
          >我创建的</el-button
        >

        <el-button
          :icon="Tools"
          :style="activeButton === '我管理的' ? activeStyle : {}"
          @click="filterGroups('我管理的')"
          >我管理的</el-button
        >

        <el-button
          :icon="User"
          :style="activeButton === '我加入的' ? activeStyle : {}"
          @click="filterGroups('我加入的')"
          >我加入的</el-button
        >
      </el-button-group>
    </div>
    <el-space wrap style="margin-left: 30px">
      <el-card class="create-card" shadow="hover" @click="dialogVisible = true">
        <el-icon size="30" style="margin-left: 15px"><Plus /></el-icon>
        <div>创建组织</div>
      </el-card>
      <el-card
        v-for="group in filteredGroupList"
        :key="group.id"
        class="box-card"
        @click="handleGroupClick(group.id)"
      >
        <!-- 头部 -->
        <template #header>
          <div class="card-header">
            <div class="card-title">
              <span style="font-size: 20px; font-weight: bold">{{
                group.name
              }}</span>
            </div>
            <div class="under-title">
              <el-tag type="primary" size="small">{{
                roleLabels[group.organizationRole]
              }}</el-tag>
              <el-icon class="info-icon" id="info-icon"><InfoFilled /></el-icon>
            </div>
          </div>
        </template>
        <!-- 中间 -->
        <div class="left-box">
          <span style="font-size: 30px; font-weight: bold">{{
            group.userCount
          }}</span>
          <div>成员</div>
        </div>
        <div class="right-box">
          <span style="font-size: 30px; font-weight: bold">{{
            group.fileCount
          }}</span>
          <div>文件</div>
        </div>
        <!-- 底部 -->
        <template #footer>
          <el-icon style="margin-right: 15px"><Calendar /></el-icon>
          <span>创建于{{ group.createdTime }}</span>
        </template>
      </el-card>
    </el-space>
  </div>

  <!-- 创建组织悬浮窗 -->
  <el-dialog v-model="dialogVisible" title="创建组织" width="30%" ref="form">
    <el-form :model="form" label-width="120px">
      <el-form-item label="组织名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="组织描述">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="成员人数">
        <el-select v-model="form.capacity" placeholder="1">
          <el-option v-for="i in 10" :key="i" :value="i">{{ i }}</el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="createGroup">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </el-form>
  </el-dialog>
  <Footer />
</template>

<script>
import {
  Menu,
  Flag,
  Tools,
  User,
  InfoFilled,
  Plus,
  Calendar,
} from "@element-plus/icons-vue";
import Footer from "@/components/Footer.vue";
import { getOrganizationListService } from "@/api/user";
import { ElMessage } from "element-plus";
import {
  createOrganizationService,
  getOrganizationShareCodeService,
} from "@/api/user";
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
const typeList = ["CREATOR", "ADMIN", "USER"];

export default defineComponent({
  components: {
    Menu,
    Flag,
    Tools,
    User,
    InfoFilled,
    Plus,
    Calendar,
    Footer,
  },

  setup() {
    const dialogVisible = ref(false);
    const activeButton = ref("全部组织");
    const selectedType = ref("全部组织");
    const router = useRouter();

    const form = ref({
      name: "",
      description: "",
      capacity: 1,
    });

    const rule = {
      name: [{ required: true, message: "请输入组织名称", trigger: "blur" }],
      description: [
        { required: true, message: "请输入组织描述", trigger: "blur" },
      ],
      capacity: [
        { required: true, message: "请输入成员人数", trigger: "blur" },
      ],
    };

    const groupList = ref([]);

    const filteredGroupList = computed(() => {
      if (selectedType.value === "全部组织") {
        return groupList.value;
      }
      return groupList.value.filter((group) => {
        if (group.organizationRole === 2) {
          return selectedType.value === "我创建的";
        }
        if (group.organizationRole === 1) {
          return selectedType.value === "我管理的";
        }
        if (group.organizationRole === 0) {
          return selectedType.value === "我加入的";
        }
      });
    });

    const roleLabels = {
      0: "普通成员",
      1: "组织管理员",
      2: "组织创建者",
    };

    const getGroupList = async () => {
      for (const type of typeList) {
        try {
          var result = await getOrganizationListService(type);
          if (result) {
            groupList.value.push(...result);
          } else {
            console.error(`Invalid response for type ${type}:`, result);
            ElMessage.error(`获取${type}组织列表失败: 响应数据无效`);
          }
        } catch (error) {
          console.error("请求失败！", type, error);
          ElMessage.error(`获取${type}组织列表失败: ` + error.message);
        }
      }
    };
    const handleGroupClick = async (id) => {
      // try {
      //   const res = await getOrganizationShareCodeService(id);
      //   console.log(res);
      //   if (res) {
      //     ElMessage.success(`已获取组织邀请码：${id}-${res}`);
      //   } else {
      //     ElMessage.error(res.message || "获取邀请码失败");
      //   }
      // } catch (error) {
      //   console.error("获取组织邀请码时出错：", error);
      //   ElMessage.error("获取组织邀请码失败，请稍后再试。");
      // }
      router.push(`/groupDetails/${id}`);
    };
    const createGroup = async () => {
      try {
        await createOrganizationService(form.value);
        if (res.code == 0) {
          ElMessage.success("创建成功");
          dialogVisible.value = false;
          getGroupList();
        } else {
          ElMessage.error(res.message);
        }
      } catch (error) {
        ElMessage.error("创建组织失败: " + error.message);
      }
    };

    const filterGroups = (type) => {
      activeButton.value = type;
      selectedType.value = type;
      return groupList.value.filter((group) => {
        switch (type) {
          case "全部组织":
            return true;
          case "我创建的":
            return group.type === "组织创建者";
          case "我管理的":
            return group.type === "组织管理员";
          case "我加入的":
            return group.type === "普通成员";
          default:
            return true;
        }
      });
    };

    onMounted(() => {
      getGroupList();
    });

    return {
      dialogVisible,
      activeButton,
      form,
      rule,
      groupList,
      filteredGroupList,
      roleLabels,
      getGroupList,
      createGroup,
      filterGroups,
      handleGroupClick,
    };
  },
});
</script>

<style scoped>
.group-view {
  padding: 50px 50px;
  margin: 0 auto;
  width: 1300px;
  background-color: #ffffff;
  margin-top: 40px;
  margin-bottom: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}
.bar {
  width: 122px;
  height: 10px;
  background-color: #3fa0fd;
  margin-bottom: 10px;
}
.group-view-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.create-card {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  width: 300px;
  background-color: #f5fbff;
  border: 1px dashed #dedede;
  border-radius: 10px;
}
.create-card:hover {
  background-color: #e8f5ff;
  border: 1px dashed #3fa0fd;
}
.box-card {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  height: 250px;
  width: 300px;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 10px;
  position: relative;
}
.box-card:hover {
  transform: translateY(-10px);
  background: linear-gradient(to bottom, #cefcff, #e4fafc);
}
.info-icon {
  position: relative;
}

.info-icon:hover::after {
  content: attr(data-info);
  font-size: 12px;
  display: block;
  position: absolute;
  top: 0;
  left: 20px;
  color: #ffffff;
  background-color: #46474b;
  padding: 5px 10px;
  border-radius: 5px;
}
/* .card-header {
  color: #ffffff;
  background: linear-gradient(to right, #40a0fe, #36cfdd);
} */
.under-title {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.left-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 40px;
  float: left;
}
.right-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  float: right;
  margin-right: 40px;
}
</style>
