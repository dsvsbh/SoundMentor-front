<template>
  <div class="container">
    <div class="header" @mousemove="updateBackground" :style="{ background }">
      <div>
        <!-- 如果头像为空，则显示默认头像 -->
        <img
          :src="userInfo.headImg || './logo.png'"
          alt="头像"
          class="avatar"
        />
        <div class="under-avatar">
          <div class="left">
            <div class="username">{{ userInfo.username }}</div>
            <div class="id">ID: 1000{{ userInfo.id }}</div>
            <div class="registration-date">
              注册时间: {{ userInfo.createdTime }}
            </div>
          </div>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            class="upload-btn"
          >
            <el-button type="primary">上传头像</el-button>
          </el-upload>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <el-tabs
      :tab-position="tabPosition"
      v-model="activeTab"
      @tab-click="handleTabClick"
      class="user-info-tabs"
      style="height: 200px"
    >
      <el-tab-pane>
        <template #label>
          <span>
            <el-icon>
              <User />
            </el-icon>
            基本信息
          </span>
        </template>
        <el-form
          :model="userForm"
          :rules="rules"
          ref="userForm"
          label-width="120px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="userForm.username"
              :disabled="false"
              :placeholder="userInfo.username"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="userForm.phone"
              :disabled="false"
              :placeholder="userInfo.phone"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input
              v-model="userForm.account"
              :disabled="true"
              :placeholder="userInfo.name"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="userForm.email"
              :disabled="true"
              :placeholder="userInfo.email"
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="saveUserInfo">保存修改</el-button>
        </el-form>
      </el-tab-pane>

      <!-- 修改密码 -->
      <el-tab-pane>
        <template #label>
          <span>
            <el-icon>
              <Lock />
            </el-icon>
            修改密码
          </span>
        </template>
        <el-form
          :model="passwordForm"
          :rules="passwordRules"
          ref="passwordForm"
          label-width="120px"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input
              type="password"
              v-model="passwordForm.oldPassword"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              type="password"
              v-model="passwordForm.newPassword"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              type="password"
              v-model="passwordForm.confirmPassword"
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="updatePassword">修改密码</el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>  

<script>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import Header from "../components/HeaderNav.vue";
import Footer from "../components/Footer.vue";
import { updateUserInfoService, updateUserPasswordService } from "../api/user";
import { User, Lock, Upload } from "@element-plus/icons-vue";
const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
export default {
  components: {
    User,
    Lock,
  },
  setup() {
    const userForm = ref({
      headImg: "",
      username: "",
      phone: "",
      account: "",
      email: "",
    });

    const passwordForm = ref({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    const rules = {
      headImg: [{ required: true, message: "请上传头像", trigger: "blur" }],
      phone: [
        {
          pattern: /^[0-9]{11}$/,
          message: "手机号必须为11位数字",
          trigger: "blur",
        },
      ],
    };

    const passwordRules = {
      oldPassword: [
        { required: true, message: "请输入原密码", trigger: "blur" },
        {
          pattern: /^[^\s]{6,16}$/,
          message: "密码长度为6-16位",
          trigger: "blur",
        },
      ],
      newPassword: [
        { required: true, message: "请输入新密码", trigger: "blur" },
      ],
      confirmPassword: [
        { required: true, message: "请确认新密码", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.value.newPassword) {
              callback(new Error("两次输入的密码不一致"));
            } else {
              callback();
            }
          },
          trigger: "blur",
        },
      ],
    };

    const activeTab = ref("基本信息");

    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

    onMounted(() => {
      userForm.value = { ...userInfo };
    });

    const handleAvatarSuccess = (res, file) => {
      userForm.value.headImg = res.data.url;
    };
    const handleAvatarError = (err, file) => {
      console.log(err);
    };

    const saveUserInfo = async () => {
      const userInfo = {
        name: this.userForm.username || "",
        phone: this.userForm.phone || "",
        headImg: this.userForm.headImg || "",
      };

      try {
        const res = await updateUserInfoService(userInfo);
        if (res.code === 0) {
          ElMessage.success("修改成功！");
        } else {
          ElMessage.error(res.message);
        }
      } catch (error) {
        ElMessage.error("请求失败，请稍后重试。");
      }
    };

    const updatePassword = async () => {
      const res = await updateUserPasswordService({});
    };

    return {
      userForm,
      passwordForm,
      rules,
      passwordRules,
      activeTab,
      saveUserInfo,
      updatePassword,
      userInfo,
      Header,
      Footer,
      background: "linear-gradient(135deg, #3fa4fa, #36cfdd)",
    };
  },
};
</script>  

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.header {
  width: 1350px;
  height: 260px;
  margin: 30px auto;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.header .avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  padding: 50px 50px;
  margin: 20px 20px;
  background-color: #fff;
  border: 1px solid #fff;
}
.header .under-avatar {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.header .left {
  width: 600px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.header .upload-btn {
  margin-top: 20px;
  margin-left: 580px;
}
.header .username {
  color: white;
  font-size: 30px;
}
.header .id {
  margin-top: 10px;
  color: rgb(58, 58, 58);
}
.header .registration-date {
  margin-top: 10px;
  color: rgb(58, 58, 58);
}
</style>
