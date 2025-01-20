<template>
  <div class="comment-box">
    <div class="head">
      <text>教学内容讲解</text>
      <el-button>智能分析</el-button>
    </div>
    <div input-box>
      <el-input placeholder="请输入或战区教学内容（800-2000字）"></el-input>
    </div>
    <div class="foot">
      <div class="words"></div>
      <el-button>生成语音</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AudioCommentary",
};
</script>
