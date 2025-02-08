<template>
  <div class="study-container">
    <div class="button-container">
      <button class="animated-button">语言学习辅助</button>
      <button class="static-button">个性化语音讲解</button>
    </div>
    <div class="card-container">
      <div class="up">
        <img :src="img1" class="card-img" alt="" />
        <div
          class="card"
          style="padding: 30px; height: 268px; width: 100%"
          @click="toLearn"
        >
          <h1 style="font-family: 'KaiTi', '楷体', serif">语言学习辅助</h1>
          <p style="color: #a9a7a7">帮助语言学习者练习发音和语言节奏</p>
        </div>
      </div>
      <div class="down">
        <div
          class="card"
          style="padding: 30px; height: 281px; width: 100%"
          @click="toAudio"
        >
          <h1 style="font-family: 'KaiTi', '楷体', serif">个性化语音讲解</h1>
          <p style="color: #a9a7a7">系统生成针对用户上传内容的语音讲解</p>
        </div>
        <img :src="img2" class="card-img" alt="" />
      </div>
    </div>
  </div>
  <Footer />
</template>  

<script setup>
import Footer from "@/components/headFoot/Footer.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
const img1 = ref(
  "http://121.43.62.36:9000/img/1738919216493_942a17a390f5518264b4adb06a3c673e.png"
);
const img2 = ref(
  "http://121.43.62.36:9000/img/1738919188800_5faa22597c686cc150b32663f179a9e1.png"
);
const router = useRouter();
const toLearn = () => {
  router.push({
    path: "/study/learn",
  });
};
const toAudio = () => {
  router.push({
    path: "/study/audio",
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
  min-height: 70vh;
  width: 1135px;
  align-items: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.button-container {
  position: relative;
  background-color: #e0f7fa;
  width: 290px;
  height: 50px;
  border-radius: 30px;
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
}

.animated-button {
  background-color: #e0f7fa;
  color: #607d8b;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
}

.static-button {
  background-color: #e0f7fa;
  color: #607d8b;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
}

.static-button:hover {
  background-color: #007bff;
  color: #fff;
}
.static-button:hover ~ .animated-button {
  background-color: #e0f7fa;
  color: #607d8b;
}
.animated-button:hover {
  background-color: #007bff;
  color: #fff;
}
.animated-button:hover ~ .static-button {
  background-color: #e0f7fa;
  color: #607d8b;
}
.card-container {
  width: 100%;
  margin-bottom: 60px;
}
.up {
  display: flex;
}
.down {
  display: flex;
  justify-content: flex-end;
}

.card:hover {
  background: linear-gradient(to bottom, #e3fdff, #f5fdfd);
}
.card-img {
  height: 48%;
  width: 48%;
}
</style>