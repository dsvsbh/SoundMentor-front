<template>
  <el-dialog v-model="visible" width="400px" @close="handleClose">
    <div v-if="isLogin">
      <div class="cover">
        <img src="/src/assets/logo.png" alt="logo" />
        <h2>SoundMentor</h2>
        <p>智能语言教学的引领者</p>
      </div>

      <el-form :model="loginForm" ref="loginFormRef" style="margin: 0 20px">
        <h3>账户登录</h3>
        <el-form-item
          prop="username"
          :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
        >
          <el-input
            v-model="loginForm.username"
            @keyup.enter="handleLogin"
            placeholder="账户"
          />
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <div class="under-pwd">
          <el-form-item style="margin-bottom: 0">
            <el-checkbox v-model="rememberMe">自动登录</el-checkbox>
          </el-form-item>
          <a
            href="javascript:void(0)"
            @click="handleForgotPassword"
            style="color: #409eff; text-decoration: none"
            >忘记密码</a
          >
        </div>
        <el-form-item>
          <el-button
            style="
              width: 100%;
              height: 40px;
              background-color: #1890ff;
              color: white;
            "
            :loading="isLoadingLogin"
            @click="handleLogin"
          >
            登录
          </el-button>
          <div class="under-login">
            <div class="left">
              <a href="" style="color: #9a9a9a">帮助</a>
              <a href="" style="color: #9a9a9a">隐私</a>
              <a href="" style="color: #9a9a9a">条款</a>
            </div>
            <div class="right">
              <a href="javascript:void(0)" @click="toggleForm">注册账号</a>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="register" v-else>
      <div class="cover">
        <img src="/src/assets/logo.png" alt="logo" />
        <h2>SoundMentor</h2>
        <p>智能语言教学的引领者</p>
      </div>

      <el-form
        :model="registerForm"
        ref="registerFormRef"
        style="margin: 0 20px"
      >
        <h3>用户注册</h3>
        <el-form-item
          prop="name"
          :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ]"
        >
          <el-input v-model="registerForm.name" placeholder="用户名" />
        </el-form-item>
        <el-form-item
          prop="username"
          :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
        >
          <el-input v-model="registerForm.username" placeholder="账号" />
        </el-form-item>
        <el-form-item
          prop="email"
          :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]"
        >
          <el-input v-model="registerForm.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item
          prop="verifyCode"
          :rules="[
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ]"
        >
          <div style="display: flex; gap: 10px">
            <el-input
              v-model="registerForm.verifyCode"
              placeholder="验证码"
              style="width: 215px"
            />
            <el-button :disabled="isCountingDown" @click="getCaptcha">
              {{
                isCountingDown ? `倒计时(${countdown}s)` : "发送验证码"
              }}</el-button
            >
          </div>
        </el-form-item>
        <el-form-item
          prop="phone"
          :rules="[
            { required: true, message: '请输入手机号码', trigger: 'blur' },
          ]"
        >
          <el-input v-model="registerForm.phone" placeholder="11位手机号"
            ><template #prepend>+86</template>
          </el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item
          prop="rePassword"
          :rules="[
            { required: true, message: '请确认密码', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (value !== this.registerForm.password) {
                  callback(new Error('两次密码不一致'));
                } else {
                  callback();
                }
              },
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="registerForm.rePassword"
            type="password"
            placeholder="确认密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="isLoadingRegister"
            @click="handleRegister"
            style="width: 155px"
          >
            注册
          </el-button>
          <a
            href="javascript:void(0)"
            @click="toggleForm"
            style="margin-left: 55px; color: #409eff; text-decoration: none"
            >使用已有账户登录</a
          >
        </el-form-item>
      </el-form>
    </div>
    <forgot-password-dialog ref="forgotPasswordRef" />
  </el-dialog>
</template>  
  
<script>
import { userLoginService, userRegisterService } from "@/api/user.js";
import { ElMessage } from "element-plus";
import ForgotPasswordDialog from "./ForgotPasswordDialog.vue";
import { sendEmailService } from "@/api/user.js";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      visible: this.modelValue,
      countdown: 60,
      timer: null,
      isCountingDown: false,
      isLogin: true,
      loginForm: {
        username: "",
        password: "",
      },
      registerForm: {
        name: "",
        email: "",
        verifyCode: "",
        phone: "",
        username: "",
        password: "",
        rePassword: "",
      },
      rememberMe: false,
      isLoadingRegister: false,
      isLoadingLogin: false,
    };
  },
  watch: {
    modelValue(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("update:modelValue", val);
    },
  },
  components: {
    ForgotPasswordDialog,
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
    },
    async handleRegister() {
      this.isLoadingRegister = true;
      this.$refs.registerFormRef.validate(async (valid) => {
        if (valid) {
          try {
            await userRegisterService({
              name: this.registerForm.name,
              username: this.registerForm.username,
              email: this.registerForm.email,
              verifyCode: this.registerForm.verifyCode,
              phone: this.registerForm.phone,
              password: this.registerForm.password,
            });
            ElMessage.success("注册成功");

            this.isLogin = true;
            this.$refs.registerFormRef.resetFields();
          } catch (error) {
            console.error("注册失败:", error);
            ElMessage.error(error.message || "注册失败");
          } finally {
            this.isLoadingRegister = false;
          }
        } else {
          this.isLoadingRegister = false;
        }
      });
    },

    async handleLogin() {
      this.isLoadingLogin = true;
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          try {
            const res = await userLoginService({
              username: this.loginForm.username,
              password: this.loginForm.password,
            });

            if (res.code == 0) {
              ElMessage.success("登录成功");
              this.visible = false;

              const storage = this.rememberMe ? localStorage : sessionStorage;
              storage.setItem("token", res.data.token);
              localStorage.setItem("isLogin", true);
              this.$router.push("/");
            } else {
              ElMessage.error(res.data || "登录失败");
            }
          } catch (error) {
            console.error("登录失败:", error);
            ElMessage.error(error.message || "登录失败，请稍后重试");
          } finally {
            this.isLoadingLogin = false; // Reset loading state
          }
        } else {
          this.isLoadingLogin = false; // Reset loading state if validation fails
        }
      });
    },
    async getCaptcha() {
      // 验证邮箱是否已填写
      if (!this.registerForm.email) {
        ElMessage.warning("请先填写邮箱");
        return;
      }

      try {
        await sendEmailService(this.registerForm.email);
        ElMessage.success("验证码已发送到您的邮箱");
        this.startCountdown();
      } catch (error) {
        console.error("发送验证码失败:", error);
        ElMessage.error(error.message || "发送验证码失败");
      }
    },

    startCountdown() {
      this.isCountingDown = true;
      this.countdown = 60; // 重置倒计时

      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.stopCountdown();
        }
      }, 1000);
    },

    stopCountdown() {
      clearInterval(this.timer);
      this.isCountingDown = false;
      this.countdown = 0;
    },
    handleForgotPassword() {
      this.$refs.forgotPasswordRef.visible = true;
    },
    handleClose() {
      this.visible = false;
      this.$router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
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
.under-pwd {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.under-login {
  display: flex;
  align-items: center;
  width: 100%;
}

.under-login .left {
  float: left;
  justify-content: space-around;
}

.under-login .right {
  float: right;
  padding-left: 147px;
}

.under-login a {
  text-decoration: none;
  color: #1890ff;
  margin: 0 5px;
  width: 40px;
}
</style>
