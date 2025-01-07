<template>
  <el-dialog v-model="visible" width="400px">
    <div v-if="isLogin">
      <div class="cover">
        <img src="../assets/logo.png" alt="logo" />
        <h2>SoundMentor</h2>
        <p>智能语言教学的引领者</p>
      </div>
      <el-form :model="loginForm" ref="loginFormRef" style="margin: 0 20px">
        <el-form-item
          prop="username"
          :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
        >
          <el-input v-model="loginForm.username" placeholder="账户" />
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
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
            @click="handleLogin"
            >登录</el-button
          >
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
        <img src="../assets/logo.png" alt="logo" />
        <h2>SoundMentor</h2>
        <p>智能语言教学的引领者</p>
      </div>

      <el-form
        :model="registerForm"
        ref="registerFormRef"
        style="margin: 0 20px"
      >
        <h3>注册</h3>
        <el-form-item
          prop="username"
          :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ]"
        >
          <el-input v-model="registerForm.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item
          prop="account"
          :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
        >
          <el-input v-model="registerForm.account" placeholder="账号" />
        </el-form-item>
        <el-form-item
          prop="email"
          :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]"
        >
          <el-input v-model="registerForm.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item
          prop="captcha"
          :rules="[
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ]"
        >
          <div style="display: flex; gap: 10px">
            <el-input
              v-model="registerForm.captcha"
              placeholder="验证码"
              style="width: 215px"
            />
            <el-button @click="getCaptcha" style="float: right"
              >获取验证码</el-button
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
        <el-form-item>
          <el-button type="primary" @click="handleRegister" style="width: 155px"
            >注册</el-button
          >
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
      isLogin: true,
      loginForm: {
        username: "",
        password: "",
      },
      registerForm: {
        username: "",
        account: "",
        email: "",
        captcha: "",
        phone: "",
        password: "",
      },
      rememberMe: false,
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
    async handleLogin() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          try {
            const res = await userLoginService({
              username: this.loginForm.username,
              password: this.loginForm.password,
            });

            ElMessage.success("登录成功");

            if (this.rememberMe) {
              localStorage.setItem("token", res.data.token);
            } else {
              sessionStorage.setItem("token", res.data.token);
            }

            // 关闭登录框
            this.visible = false;

            // 跳转到首页
            this.$router.push("/home");
          } catch (error) {
            console.error("登录失败:", error);
            ElMessage.error(error.message || "登录失败");
          }
        }
      });
    },
    async handleRegister() {
      this.$refs.registerFormRef.validate(async (valid) => {
        if (valid) {
          try {
            // 调用注册接口
            await userRegisterService(this.registerForm);
            ElMessage.success("注册成功");

            // 切换到登录表单
            this.isLogin = true;
            this.$refs.registerFormRef.resetFields();
          } catch (error) {
            console.error("注册失败:", error);
            ElMessage.error(error.message || "注册失败");
          }
        }
      });
    },
    getCaptcha() {
      alert("验证码已发送！");
    },
    handleForgotPassword() {
      this.$refs.forgotPasswordRef.visible = true;
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
