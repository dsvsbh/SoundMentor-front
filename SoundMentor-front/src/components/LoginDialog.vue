<template>
  <el-dialog v-model="visible" title="SoundMentor" width="400px">
    <div v-if="isLogin">
      <h3>账户管理登录</h3>
      <el-form :model="loginForm" ref="loginFormRef">
        <el-form-item
          label="账号"
          prop="username"
          :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
        >
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input v-model="loginForm.password" type="password" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button @click="toggleForm">注册账号</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <h3>注册账号</h3>
      <el-form :model="registerForm" ref="registerFormRef">
        <el-form-item
          label="用户名"
          prop="username"
          :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ]"
        >
          <el-input v-model="registerForm.username" />
        </el-form-item>
        <el-form-item
          label="账号"
          prop="account"
          :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
        >
          <el-input v-model="registerForm.account" />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
          :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]"
        >
          <el-input v-model="registerForm.email" />
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="captcha"
          :rules="[
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ]"
        >
          <el-input v-model="registerForm.captcha" />
          <el-button @click="getCaptcha">获取验证码</el-button>
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="phone"
          :rules="[
            { required: true, message: '请输入手机号码', trigger: 'blur' },
          ]"
        >
          <el-input v-model="registerForm.phone" placeholder="+86" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input v-model="registerForm.password" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">注册</el-button>
          <el-button @click="toggleForm">返回登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>  
  
  <script>
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
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
    },
    handleLogin() {
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          // 登录逻辑
          alert("登录成功！");
        } else {
          console.log("登录表单验证失败");
        }
      });
    },
    handleRegister() {
      this.$refs.registerFormRef.validate((valid) => {
        if (valid) {
          // 注册逻辑
          alert("注册成功！");
        } else {
          console.log("注册表单验证失败");
        }
      });
    },
    getCaptcha() {
      alert("验证码已发送！");
    },
  },
};
</script>  
  
  <style scoped>
h3 {
  margin-bottom: 20px;
  text-align: center;
}
</style>