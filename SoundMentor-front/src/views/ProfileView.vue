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
            <el-button style="margin-right: 40px" link @click="uploadAvatar"
              >上传头像</el-button
            >
          </el-upload>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <el-container>
      <el-aside class="aside">
        <el-menu :default-active="activeTab" @select="handleSelect">
          <el-menu-item @click="activeTab = '基本信息'" index="1">
            <template #title>
              <el-icon><User /></el-icon>
              <span>基本信息</span>
            </template>
          </el-menu-item>
          <el-menu-item @click="activeTab = '修改密码'" index="2">
            <template #title>
              <el-icon><Lock /></el-icon>
              <span>修改密码</span>
            </template>
          </el-menu-item>
          <el-menu-item @click="activeTab = '我的文件'" index="3">
            <template #title>
              <el-icon><Upload /></el-icon>
              <span>我的文件</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <template v-if="activeTab === '基本信息'">
          <text style="font-size: 24px; font-weight: bold; margin-left: 60px"
            >基本信息</text
          >
          <div class="info-form">
            <el-form :model="userForm" :rules="rules" ref="userFormRef">
              <div class="center">
                <div class="left">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username" />
                  </el-form-item>
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userForm.phone" />
                  </el-form-item>
                </div>
                <div class="right">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email" disabled="true" />
                  </el-form-item>
                  <el-form-item label="账号" prop="name">
                    <el-input v-model="userForm.name" disabled="true" />
                  </el-form-item>
                </div>
              </div>
              <el-button
                type="primary"
                @click="saveUserInfo"
                style="width: 200px; margin: 20px 200px"
                >保存修改</el-button
              >
            </el-form>
          </div>
        </template>
        <template v-if="activeTab === '修改密码'">
          <text style="font-size: 24px; font-weight: bold; margin-left: 60px"
            >修改密码</text
          >
          <div class="password-form">
            <el-form
              :model="passwordForm"
              :rules="passwordRules"
              ref="passwordFormRef"
            >
              <el-form-item label="原密码" prop="oldPassword">
                <el-input
                  v-model="passwordForm.oldPassword"
                  style="width: 213px"
                />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="passwordForm.newPassword"
                  style="width: 213px"
                />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  style="width: 200px"
                />
              </el-form-item>
            </el-form>
          </div>
          <el-button
            type="primary"
            @click="updatePassword"
            style="width: 200px; margin: 20px 280px"
            >确认修改</el-button
          >
        </template>
        <template v-if="activeTab === '我的文件'">
          <text style="font-size: 24px; font-weight: bold; margin-left: 60px"
            >我的文件</text
          >
        </template>
      </el-main>
    </el-container>
  </div>
  <Footer />
</template>  

<script>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import Footer from "../components/Footer.vue";
import { updateUserInfoService, updateUserPasswordService } from "../api/user";
import { User, Lock, Upload } from "@element-plus/icons-vue";
import { formatDate } from "@/utils/TimeFromUtil";
const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
export default {
  components: {
    User,
    Lock,
    Footer,
    Upload,
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
    const handleSelect = (key, keyPath) => {
      activeTab.value = key;
    };
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

    onMounted(() => {
      userForm.value = { ...userInfo };
      userForm.value.createdTime = formatDate(userInfo.createdTime);
    });

    const handleAvatarSuccess = (res, file) => {
      userForm.value.headImg = res.data.url;
    };
    const handleAvatarError = (err, file) => {
      console.log(err);
    };

    const saveUserInfo = async () => {
      const userInfo = {
        name: userForm.username || "",
        phone: userForm.phone || "",
        headImg: userForm.headImg || "",
      };
      console.log(userInfo);

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
      formatDate,
      passwordForm,
      rules,
      passwordRules,
      activeTab,
      saveUserInfo,
      updatePassword,
      handleSelect,
      userInfo,
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
  margin-bottom: 30px;
}
.header {
  width: 1080px;
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
  margin-left: 20px;
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
.aside {
  width: 250px;
  height: 168px;
  margin-right: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.main {
  width: 800px;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.info-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
}
.info-form .center {
  padding: 10px 10px;
  height: 100px;
  width: 610px;
  border-style: solid;
  border-width: 1px 0 1px 0;
  border-color: #e8e8e8;
}
.info-form .left {
  float: left;
}
.info-form .right {
  margin-left: 100px;
  float: right;
}
.password-form {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  margin-left: 60px;
  width: 610px;
  border-style: solid;
  border-width: 1px 0 1px 0;
  padding-top: 10px;
  border-color: #e8e8e8;
}
</style>

