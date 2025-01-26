<template>
  <div class="sound-trained-list">
    <el-table :data="paginatedSoundList" class="sound-tb" style="width: 100%">
      <el-table-column prop="soundName" label="音频名称" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-select
            v-model="row.status"
            @change="updateStatus(row)"
            placeholder="选择状态"
          >
            <el-option label="创建" :value="0" />
            <el-option label="执行中" :value="1" />
            <el-option label="成功" :value="2" />
            <el-option label="失败" :value="3" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <text style="color: #409eff" @click="deleteSound(row.id)">删除</text>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getTrainedSoundPageQuery } from "@/api/voice";
const userInfo = localStorage.getItem("userInfo");

// 训练历史
// 定义响应式变量
const soundList = ref([]);
const paginatedSoundList = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const totalCount = ref(0);

onMounted(() => {
  fetchAudioList();
});
// 获取音频列表的函数
const fetchAudioList = async () => {
  const form = {
    current: currentPage.value,
    size: pageSize.value,
  };
  try {
    const result = await getTrainedSoundPageQuery(form);
    if (result.code === "0") {
      console.log("11111111");
      soundList.value = result.data;
      totalCount.value = result.data.totalCount;
      updatePaginatedList();
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    ElMessage.error("获取数据失败: " + error.message);
  }
};

// 更新分页列表
// 更新分页列表
const updatePaginatedList = () => {
  if (Array.isArray(soundList.value)) {
    const start = (currentPage.value - 1) * pageSize.value;
    paginatedSoundList.value = soundList.value.slice(
      start,
      start + pageSize.value
    );
  } else {
    paginatedSoundList.value = [];
  }
};

// 处理当前页码变化
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  updatePaginatedList();
};

// 处理页面大小变化
const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 重置到第一页
  updatePaginatedList();
};

// 更新状态
const updateStatus = (row) => {
  // 在这里处理状态更新逻辑，例如发送请求到后端
  ElMessage.success(`状态已更新为: ${row.status}`);
};

// 删除音频
const deleteSound = async (id) => {
  // 在这里处理删除逻辑，例如发送请求到后端
  ElMessage.success(`音频 ID ${id} 已删除`);
};
</script>

<style scoped>
.sound-list {
  margin: 20px 40px;
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sound-tb {
  border-radius: 10px;
}
</style>