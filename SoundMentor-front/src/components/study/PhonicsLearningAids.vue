<template>
  <div class="phonic-container">
    <div class="header">
      <text style="font-size: 30px; font-weight: bold">语言学习辅助</text>
      <div class="bar"></div>
    </div>
    <div class="cards">
      <div class="card-item" v-for="item in studyList" :key="item.id">
        <div class="title">
          <text>
            {{ item.title }}
          </text>
        </div>
        <div class="function">
          <div class="func">
            <div class="icon">
              <el-icon><List /></el-icon>
            </div>
            <div class="item-title">单词练习</div>
            <div class="content">基础发音练习，掌握声调和音节</div>
          </div>
          <div class="func">
            <div class="icon">
              <el-icon><Avatar /></el-icon>
            </div>
            <div class="item-title">演讲练习</div>
            <div class="content">长篇演讲练习，锻炼表达能力</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { List, Avatar } from "@element-plus/icons-vue";
const studyList = ref([
  {
    id: 1,
    title: "普通话",
  },
  {
    id: 2,
    title: "英语",
  },
  {
    id: 3,
    title: "...",
  },
]);
</script>

<style scoped>
.header {
  height: 60px;
}
.bar {
  height: 10px;
  width: 122px;
  background: linear-gradient(135deg, #3fa4fa, #36cfdd);
}
</style>