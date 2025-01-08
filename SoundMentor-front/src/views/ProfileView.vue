<template>
  <div class="profile-view">
    <h1>个人信息</h1>
    <div class="profile-info">
      <el-form :model="form" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
    };
  },
  mounted() {
    this.form = JSON.parse(localStorage.getItem("userInfo"));
  },
  methods: {
    updateProfile() {
      console.log(this.form);
    },
  },
};
</script>
