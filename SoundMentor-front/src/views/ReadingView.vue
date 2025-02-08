<template>
  <div class="up-box">
    <div class="left-box">
      <div class="head">
        <text style="font-size: 22px; font-weight: bold">文本朗读</text>
        <el-button type="primary">生成语音</el-button>
      </div>
      <el-divider />
      <el-input
        placeholder="请输入或粘贴教学内容（800-2000字）"
        v-model="text"
        type="textarea"
        :autosize="{ minRows: 16, maxRows: 16 }"
        style="width: 93%; margin: 0 25px"
      />
      <div
        class="words"
        style="color: #cccccc; font-size: 14px; margin: 15px 25px"
      >
        当前字数： / 2000
      </div>
    </div>
    <div class="right-box">
      <div class="title">
        <el-icon size="20"><Operation /></el-icon>
        <div style="font-size: 18px">基础设置</div>
      </div>
      <p style="color: #606266">语言选择</p>
      <el-select v-model="value" placeholder="请选择语言" style="width: 200px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <p style="color: #606266">语速调节</p>
      <el-button-group class="ml-4">
        <el-button>慢速</el-button>
        <el-button>正常</el-button>
        <el-button>快速</el-button>
      </el-button-group>
      <el-slider :max="2" :min="0.5" :step="0.1" v-model="speed"></el-slider>
      <el-divider />
      <div class="title">
        <el-icon size="20"><Headset /></el-icon>
        <div style="font-size: 18px">音频设置</div>
      </div>
    </div>
  </div>
  <div class="down-box"></div>
  <Footer />
</template>
<script setup>
import Footer from "@/components/headFoot/Footer.vue";
import { Operation, Headset } from "@element-plus/icons-vue";
import { ref } from "vue";

const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];

const speed = ref(1);
</script>
<style scoped>
.up-box {
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin: 30px auto;
  min-height: 70vh;
  width: 1180px;
}
.left-box {
  flex: 3;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.head {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
.right-box {
  flex: 1.2;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.title {
  display: flex;
  gap: 5px;
  align-items: center;
}
.down-box {
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin: 40px auto;
  min-height: 60vh;
  width: 1180px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
</style>