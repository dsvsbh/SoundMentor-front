<template>
  <div class="sound-trained-list">
    <div class="head">
      <text style="font-size: 22px; font-weight: bold; color: #5d5d5d"
        >文本朗读</text
      >
      <el-button type="danger" @click="deleteSound">批量删除</el-button>
    </div>

    <el-dialog v-model="isDelete" title="音频删除" width="25%">
      <div style="marign">
        <p>确定要删除音频吗？</p>
        <el-button type="danger" @click="confirmDelete">确认</el-button>
        <el-button type="default" @click="isDelete = false">取消</el-button>
      </div>
    </el-dialog>
    <el-table
      :data="paginatedSoundList"
      class="sound-tb"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="soundName" label="音频名称" />
      <el-table-column prop="status" label="状态" width="155">
        <template #header>
          <el-select
            v-model="searchStatus"
            @change="handleStatusChange"
            placeholder="选择状态"
            clearable
          >
            <el-option label="全部" :value="null" />
            <el-option label="创建" :value="0" />
            <el-option label="执行中" :value="1" />
            <el-option label="成功" :value="2" />
            <el-option label="失败" :value="3" />
          </el-select>
        </template>
        <!-- 表格内容显示状态 -->
        <template #default="{ row }">
          <span>{{ getStatusLabel(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"> </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handlePageSizeChange"
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
import { getTrainedSoundPageQuery, deleteSoundLib } from "@/api/voice";
import { formatDate } from "@/utils/TimeFromUtil";

// 用户信息
const userInfo = localStorage.getItem("userInfo");

// 定义响应式变量
const soundList = ref([]);
const paginatedSoundList = ref([]);
const currentPage = ref(1); // 当前页码
const pageSize = ref(5); // 每页大小
const totalCount = ref(0); // 总条数
const searchStatus = ref(null); // 查询状态

// 状态映射
const statusOptions = [
  { label: "创建", value: 0 },
  { label: "执行中", value: 1 },
  { label: "成功", value: 2 },
  { label: "失败", value: 3 },
];

// 根据状态值获取状态标签
const getStatusLabel = (status) => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option ? option.label : "未知状态";
};

// 初始化加载数据
onMounted(() => {
  fetchAudioList();
});

// 文件名格式化函数
const formatFileName = (fileName, maxLength) => {
  if (!fileName) return "内容为空";

  // 如果文件名大于 maxLength，则截断并添加 '...'
  if (fileName.length > maxLength) {
    return `${fileName.slice(0, maxLength)}...`;
  }

  // 如果文件名不足 maxLength，则填充到 maxLength 的占位符（用空格填充）
  return fileName.padEnd(maxLength, " ");
};

// 获取音频列表的函数
const fetchAudioList = async () => {
  const form = {
    current: currentPage.value,
    size: pageSize.value,
    status: searchStatus.value,
  };
  try {
    const result = await getTrainedSoundPageQuery(form);
    if (result.code === "0") {
      soundList.value = result.data.records.map((record) => ({
        ...record,
        soundName: formatFileName(record.soundName, 30),
        createTime: formatDate(record.createTime),
      }));
      totalCount.value = result.data.total;
      updatePaginatedList();
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    ElMessage.error("获取数据失败: " + error.message);
  }
};

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
  fetchAudioList();
};

// 处理页面大小变化
const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 重置到第一页
  fetchAudioList();
};

// =======================删除音频========================
const selectedIds = ref([]); // 选中的音频 ID 列表
// 处理状态查询条件变化
const handleStatusChange = () => {
  currentPage.value = 1; // 重置到第一页
  fetchAudioList();
};
const isDelete = ref(false);
// 批量删除
const deleteSound = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请先选择要删除的音频");
    return;
  }
  isDelete.value = true;
};
// 处理表格选中行变化
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((row) => row.id); // 提取选中行的 ID
};
// 确认删除
const confirmDelete = async () => {
  try {
    const form = {
      idList: selectedIds.value,
    };
    const result = await deleteSoundLib(form);
    if (result.code === "0") {
      ElMessage.success("删除成功");
      fetchAudioList(); // 刷新表格数据
    } else {
      ElMessage.error(result.data);
    }
  } catch (error) {
    ElMessage.error("删除失败: " + error.message);
  } finally {
    isDelete.value = false; // 关闭对话框
  }
};
</script>
<style scoped>
.sound-trained-list {
  margin: 0 140px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  border-radius: 0 0 10px 10px;
  padding: 20px;
}
.head {
  margin: 20px;
  display: flex;
  justify-content: space-between;
  height: 50px;
  border-bottom: 1px solid #dcdfe6;
}
.sound-tb {
  min-height: 28vh;
}
.el-pagination {
  margin-top: 30px;
  justify-content: center;
  align-items: end;
}
</style>