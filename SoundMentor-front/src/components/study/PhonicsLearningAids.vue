<template>
  <div class="study-container">
    <div class="phonic-container">
      <div class="header">
        <div style="display: flex; align-items: center; gap: 15px">
          <div
            style="
              font-size: 27px;
              font-weight: bold;
              margin-top: 20px;
              color: #5d5d5d;
            "
          >
            语言学习辅助
          </div>
          <el-tag type="info" size="small" style="margin-top: 20px">
            暂时只支持中文和英文
          </el-tag>
        </div>
        <div class="bar"></div>
      </div>
      <el-divider />
      <div class="cards">
        <div class="card-item" v-for="item in studyList" :key="item.id">
          <div class="title">
            <div class="text">
              {{ item.title }}
            </div>
          </div>
          <div class="function">
            <div class="func">
              <div class="icon">
                <el-icon color="#409eff" size="30" style="padding: 10px">
                  <List />
                </el-icon>
              </div>
              <div class="right" @click="practiceWords(item.title)">
                <div class="item-title">单词练习</div>
                <div class="content" style="font-size: 12px; color: #909399">
                  基础发音练习，掌握声调和音节
                </div>
              </div>
            </div>
            <div class="func">
              <div class="icon">
                <el-icon color="#409eff" size="30" style="padding: 10px">
                  <Avatar />
                </el-icon>
              </div>
              <div class="right" @click="practiceSpeech(item.title)">
                <div class="item-title">朗诵练习</div>
                <div class="content" style="font-size: 12px; color: #909399">
                  诗歌朗诵练习，锻炼表达能力
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-backtop :right="100" :bottom="100" />
  <Footer />
</template>

<script setup>
import { ref } from "vue";
import Footer from "../headFoot/Footer.vue";
import { List, Avatar } from "@element-plus/icons-vue";
import router from "@/router";

// 语言到参数的映射
const languageMap = {
  普通话: "chinese",
  英语: "english",
};

const studyList = ref([
  { id: 1, title: "普通话" },
  { id: 2, title: "英语" },
]);

// 动态跳转到单词练习页面
const practiceWords = (title) => {
  console.log(title);
  const languageParam = languageMap[title] || "chinese";
  router.push({
    path: `/study/learn/words`,
    query: { language: languageParam },
  });
};

// 动态跳转到朗诵练习页面
const practiceSpeech = (title) => {
  const languageParam = languageMap[title] || "chinese";
  router.push({
    path: `/study/learn/speech`,
    query: { language: languageParam },
  });
};
</script>

<style scoped>
.study-container {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 30px auto;
  border-radius: 15px;
  min-height: 60vh;
  width: 1135px;
  align-items: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.header {
  height: 60px;
  margin-left: 30px;
}
.bar {
  height: 10px;
  width: 122px;
  background: linear-gradient(135deg, #3fa4fa, #36cfdd);
}
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 20px;
  padding: 0 30px;
  padding-bottom: 30px;
  justify-items: center;
}
.card-item {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 330px;
}
.title {
  color: #ffffff;
  background: linear-gradient(135deg, #3fa4fa, #36cfdd);
  border-radius: 8px 8px 0 0;
  height: 70px;
  align-items: center;
}
.title .text {
  padding: 23px 30px;
  font-size: 22px;
  font-weight: bold;
}
.func {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  margin: 15px 15px;
  border-radius: 8px;
  cursor: pointer;
}
.func .right {
  display: flex;
  flex-direction: column;
}
.func .icon {
  height: 50px;
  width: 50px;
  background-color: #ffffff;
  margin: 10px;
  border-radius: 8px;
}
</style>