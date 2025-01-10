<template>
  <el-dialog
    align-center
    v-model="dialogVisible"
    title="输入邀请码"
    @close="resetShareCode"
  >
    <el-input v-model="shareCode" placeholder="请输入邀请码"></el-input>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmJoin">确认</el-button>
    </span>
  </el-dialog>
</template>  
  
<script>
import { ref } from "vue";
import { joinOrganizationService } from "@/api/user";
import { ElMessage } from "element-plus";

export default {
  name: "InputShareCode",
  setup() {
    const dialogVisible = ref(false);
    return {
      dialogVisible,
    };
  },
  data() {
    return {
      shareCode: "",
    };
  },
  methods: {
    resetShareCode() {
      this.shareCode = "";
      this.$router.push("/");
    },
    async confirmJoin() {
      try {
        const underscoreIndex = this.shareCode.indexOf("-");
        if (underscoreIndex === -1) {
          ElMessage.error("输入格式错误，请输入组织ID-邀请码");
        }

        const organizationId = this.shareCode.substring(0, underscoreIndex);
        const shareCode = this.shareCode.substring(underscoreIndex + 1);

        const data = {
          organizationId,
          shareCode,
        };
        await joinOrganizationService(data);
        if (response.code === 0) {
          ElMessage.success("加入成功！");
          this.$emit("update:dialogVisible", false);
          this.resetShareCode();
        } else {
          ElMessage.error(error.data);
        }
      } catch (error) {
        ElMessage.error(error.data);
        console.error(error);
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.resetShareCode();
      router.push("/");
    },
  },
};
</script>  