<template>
  <el-dialog v-model="visible" width="400px" :close-on-click-modal="false">
    <div class="cover">
      <img src="/src/assets/logo.png" alt="logo" />
      <h2>SoundMentor</h2>
      <p>智能语言教学的引领者</p>
    </div>
    <h3 style="margin-left: 20px">忘记密码</h3>
    <el-form
      ref="forgotFormRef"
      :model="forgotForm"
      :rules="rules"
      class="forgot-form"
    >
      <el-form-item prop="email">
        <el-input v-model="forgotForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div style="display: flex; gap: 10px">
          <el-input
            v-model="forgotForm.code"
            placeholder="输入验证码"
            style="width: 215px"
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
      <el-form-item prop="phone">
        <el-input
          v-model="forgotForm.phone"
          placeholder="请输入11位手机号"
          maxlength="11"
        >
          <template #prepend>+86</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="forgotForm.password"
          type="password"
          placeholder="请输入6-16位新密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="forgotForm.confirmPassword"
          type="password"
          placeholder="请确认新密码"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer" style="margin: 20px 0">
      <el-button type="primary" @click="handleSubmit">确认</el-button>
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
  
  <script>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import request from "@/utils/request";

export default {
  name: "ForgotPasswordDialog",
  setup() {
    const visible = ref(false);
    const forgotFormRef = ref(null);
    const countDown = ref(0);
    const isCountingDown = ref(false);
    const handleForgotPassword = () => {
      visible.value = true;
    };

    const forgotForm = reactive({
      email: "",
      code: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    const rules = {
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
      confirmPassword: [
        { required: true, message: "请确认新密码", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value !== forgotForm.password) {
              callback(new Error("两次输入的密码不一致"));
            } else {
              callback();
            }
          },
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
      if (!forgotForm.email || !forgotForm.phone) {
        ElMessage.warning("请先完整填写邮箱和手机号");
        return;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(forgotForm.email)) {
        ElMessage.warning("请输入正确的邮箱格式");
        return;
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(forgotForm.phone)) {
        ElMessage.warning("请输入正确的手机号格式");
        return;
      }

      try {
        await request({
          url: "/user/sendEmail",
          method: "post",
          data: {
            email: forgotForm.email,
          },
        });

        startCountDown();
        ElMessage.success("验证码已发送到您的邮箱");
      } catch (error) {
        ElMessage.error(error.message || "验证码发送失败");
      }
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
      handleForgotPassword,
    };
  },
};
</script>

<style scoped>
.cover {
  background: linear-gradient(to bottom, #e3fdff, #f4fdfd);
  padding: 20px;
  margin-bottom: 20px;
  margin: 0 20px 20px 20px;
}
.cover h2 {
  margin-bottom: 20px;
  text-align: center;
}
.cover img {
  width: 50px;
  height: 50px;
  display: block;
  margin: 0 auto;
}
.cover p {
  text-align: center;
}
.forgot-form {
  margin: 0 20px 20px 20px;
}
.dialog-footer {
  margin: 0 auto;
  padding: 0 20px 0 20px;
  margin-top: -15px;
  display: flex;
  justify-content: space-between;
}
.dialog-footer button {
  width: 200px;
}
</style>
