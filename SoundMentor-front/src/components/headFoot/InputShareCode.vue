<template>
  <el-dialog
    align-center
    v-model="dialogVisible"
    title="输入邀请码"
    @close="resetShareCode"
  >
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="shareCode">
        <el-input
          v-model="form.shareCode"
          placeholder="请输入邀请码"
        ></el-input>
      </el-form-item>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmJoin">确认</el-button>
      </span>
    </el-form>
  </el-dialog>
</template>  
  
<script>
import { ref } from "vue";
import { joinOrganizationService } from "@/api/group";
import { ElMessage } from "element-plus";

export default {
  name: "InputShareCode",
  setup() {
    const dialogVisible = ref(false);
    const form = ref({ shareCode: "" });

    return {
      dialogVisible,
      form,
    };
  },
  data() {
    return {
      rules: {
        shareCode: [
          { required: true, message: "请输入邀请码", trigger: "blur" },
          {
            pattern: /^\d+-.*$/,
            message: "请输入组织ID-邀请码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetShareCode() {
      this.form.shareCode = "";
      this.$router.push("/");
    },
    async confirmJoin() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) {
          ElMessage.error("邀请码格式错误！");
          return;
        }

        try {
          const underscoreIndex = this.form.shareCode.indexOf("-");
          const organizationId = this.form.shareCode.substring(
            0,
            underscoreIndex
          );
          const shareCode = this.form.shareCode.substring(underscoreIndex + 1);

          const data = {
            organizationId,
            shareCode,
          };
          console.log(data);
          const response = await joinOrganizationService(data);

          if (response.code == 0) {
            ElMessage.success("加入成功！");
            this.$emit("update:dialogVisible", false);
            this.resetShareCode();
          } else {
            ElMessage.error(response.message);
          }
        } catch (error) {
          ElMessage.error(error.data || "发生错误，请重试");
          console.error(error);
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.resetShareCode();
      this.$router.push("/");
    },
  },
};
</script>  
  
<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.el-button {
  width: 200px;
}
</style>