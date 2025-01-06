<template>
  <el-dialog v-model="visible" width="400px" :close-on-click-modal="false">
    <div class="cover">
      <img src="../assets/logo.png" alt="logo" />
      <h2>SoundMentor</h2>
      <p>智能语言教学的引领者</p>
    </div>
    <el-form
      ref="forgotFormRef"
      :model="forgotForm"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="账号" prop="username">
        <el-input
          v-model="forgotForm.username"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="forgotForm.email"
          placeholder="请输入邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div style="display: flex; gap: 10px">
          <el-input
            v-model="forgotForm.code"
            placeholder="请输入验证码"
          ></el-input>
          <el-button
            type="primary"
            :disabled="isCountingDown"
            @click="getVerificationCode"
          >
            {{ countDownText }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="forgotForm.phone"
          placeholder="请输入11位手机号"
          maxlength="11"
        >
          <template #prepend>+86</template>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="forgotForm.password"
          type="password"
          placeholder="请输入6-16位新密码"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
  <script>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

export default {
  name: "ForgotPasswordDialog",
  setup() {
    const visible = ref(false);
    const forgotFormRef = ref(null);
    const countDown = ref(0);
    const isCountingDown = ref(false);

    const forgotForm = reactive({
      username: "",
      email: "",
      code: "",
      phone: "",
      password: "",
    });

    const rules = {
      username: [{ required: true, message: "请输入账号", trigger: "blur" }],
      email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
      ],
      code: [
        { required: true, message: "请输入验证码", trigger: "blur" },
        { len: 6, message: "验证码长度必须为6位", trigger: "blur" },
      ],
      phone: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        {
          pattern: /^1[3-9]\d{9}$/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        {
          min: 6,
          max: 16,
          message: "密码长度必须在6-16位之间",
          trigger: "blur",
        },
      ],
    };

    const countDownText = ref("获取验证码");

    const startCountDown = () => {
      isCountingDown.value = true;
      countDown.value = 60;
      const timer = setInterval(() => {
        countDown.value--;
        countDownText.value = `${countDown.value}秒后重试`;
        if (countDown.value <= 0) {
          clearInterval(timer);
          isCountingDown.value = false;
          countDownText.value = "获取验证码";
        }
      }, 1000);
    };

    const getVerificationCode = async () => {
      if (!forgotForm.email) {
        ElMessage.warning("请先输入邮箱");
        return;
      }
      // TODO: 调用发送验证码接口
      startCountDown();
      ElMessage.success("验证码已发送到您的邮箱");
    };

    const handleSubmit = () => {
      forgotFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            // TODO: 调用重置密码接口
            ElMessage.success("密码重置成功");
            visible.value = false;
            forgotFormRef.value.resetFields();
          } catch (error) {
            ElMessage.error(error.message || "密码重置失败");
          }
        }
      });
    };

    return {
      visible,
      forgotForm,
      forgotFormRef,
      rules,
      isCountingDown,
      countDownText,
      getVerificationCode,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.cover {
  background: linear-gradient(to bottom, #e3fdff, #f4fdfd);
  padding: 20px;
  margin-bottom: 20px;
}
h2 {
  margin-bottom: 20px;
  text-align: center;
}
img {
  width: 50px;
  height: 50px;
  display: block;
  margin: 0 auto;
}
p {
  text-align: center;
}
</style>
