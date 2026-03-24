<template>
  <div class="hospital-data-page">
    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入医院名称关键词"
        clearable
        class="search-input"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch" :loading="loading">
        搜索
      </el-button>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-select
        v-model="selectedProvince"
        placeholder="选择省份"
        clearable
        class="filter-select"
        @change="handleProvinceChange"
      >
        <el-option
          v-for="province in provinceList"
          :key="province"
          :label="province"
          :value="province"
        />
      </el-select>

      <el-select
        v-model="selectedCity"
        placeholder="选择城市"
        clearable
        class="filter-select"
        :disabled="!selectedProvince"
        @change="handleCityChange"
      >
        <el-option
          v-for="city in cityList"
          :key="city"
          :label="city"
          :value="city"
        />
      </el-select>

      <el-select
        v-model="selectedHospitalLevel"
        placeholder="选择医院等级"
        clearable
        class="filter-select"
        @change="handleHospitalLevelChange"
      >
        <el-option
          v-for="level in hospitalLevelList"
          :key="level"
          :label="level"
          :value="level"
        />
      </el-select>

      <el-button type="primary" @click="handleFilter" :loading="loading">
        筛选
      </el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 搜索结果表格 -->
    <div class="table-container">
      <el-table 
        :data="hospitalList" 
        border 
        stripe
        style="width: 100%"
        v-loading="loading"
        element-loading-text="加载中..."
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="hospitalName" label="医院名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="hospitalLevel" label="医院等级" width="120" align="center" />
        <el-table-column prop="province" label="省份" width="100" align="center" />
        <el-table-column prop="city" label="城市" width="100" align="center" />
        <el-table-column prop="districtCounty" label="区县" width="120" align="center" show-overflow-tooltip />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

// 搜索关键词
const searchKeyword = ref('')

// 筛选条件
const selectedProvince = ref('')
const selectedCity = ref('')
const selectedHospitalLevel = ref('')

// 省份列表
const provinceList = ref([
  '上海市', '云南省', '内蒙古自治区', '北京市', '台湾省', '吉林省', '四川省', '天津市',
  '宁夏回族自治区', '安徽省', '山东省', '山西省', '广东省', '广西壮族自治区', '新疆维吾尔自治区',
  '江苏省', '江西省', '河北省', '河南省', '浙江省', '海南省', '湖北省', '湖南省', '甘肃省',
  '福建省', '西藏自治区', '贵州省', '辽宁省', '重庆市', '陕西省', '青海省', '黑龙江省'
])

// 医院等级列表
const hospitalLevelList = ref([
  '三级乙等', '三级医院', '三级甲等', '二级乙等', '二级医院', '二级甲等'
])

// 城市列表
const cityList = ref([])

// 列表数据
const hospitalList = ref([])
const loading = ref(false)
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(20)

// 当前使用的搜索模式：'search' - 关键词搜索，'filter' - 筛选
const searchMode = ref('search')

// 获取城市列表
const fetchCities = async (province) => {
  if (!province) {
    cityList.value = []
    return
  }
  
  try {
    const res = await request.get('/admin/hospital/cities', {
      params: { province }
    })
    
    if (res.code === 200 && res.data) {
      cityList.value = res.data || []
    } else {
      cityList.value = []
    }
  } catch (error) {
    console.error('获取城市列表失败:', error)
    cityList.value = []
  }
}

// 获取医院数据（筛选模式）
const fetchHospitalDataByFilter = async () => {
  if (!selectedCity.value) {
    ElMessage.warning('请先选择城市')
    return
  }
  
  loading.value = true
  try {
    const params = {
      city: selectedCity.value,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }
    
    if (selectedHospitalLevel.value) {
      params.hospitalLevel = selectedHospitalLevel.value
    }
    
    const res = await request.get('/admin/hospital/hospitals', { params })
    
    if (res.code === 200 && res.data) {
      hospitalList.value = res.data.records || []
      total.value = res.data.total || 0
      pageNum.value = res.data.current || 1
    }
  } catch (error) {
    console.error('获取医院数据失败:', error)
    ElMessage.error('获取医院数据失败')
    hospitalList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 获取医院数据（搜索模式）
const fetchHospitalData = async () => {
  loading.value = true
  try {
    const res = await request.get('/admin/hospital/search', {
      params: {
        keyword: searchKeyword.value,
        pageNum: pageNum.value,
        pageSize: pageSize.value
      }
    })
    
    if (res.code === 200 && res.data) {
      hospitalList.value = res.data.records || []
      total.value = res.data.total || 0
      pageNum.value = res.data.current || 1
    }
  } catch (error) {
    console.error('获取医院数据失败:', error)
    ElMessage.error('获取医院数据失败')
    hospitalList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索功能
const handleSearch = () => {
  searchMode.value = 'search'
  // 清空筛选条件
  selectedProvince.value = ''
  selectedCity.value = ''
  selectedHospitalLevel.value = ''
  cityList.value = []
  pageNum.value = 1
  fetchHospitalData()
}

// 省份变化
const handleProvinceChange = async () => {
  selectedCity.value = ''
  cityList.value = []
  if (selectedProvince.value) {
    await fetchCities(selectedProvince.value)
  }
}

// 城市变化
const handleCityChange = () => {
  // 城市变化时不自动请求，等待点击筛选按钮
}

// 医院等级变化
const handleHospitalLevelChange = () => {
  // 医院等级变化时不自动请求，等待点击筛选按钮
}

// 筛选功能
const handleFilter = () => {
  searchMode.value = 'filter'
  // 清空搜索关键词
  searchKeyword.value = ''
  pageNum.value = 1
  fetchHospitalDataByFilter()
}

// 重置筛选
const handleReset = () => {
  selectedProvince.value = ''
  selectedCity.value = ''
  selectedHospitalLevel.value = ''
  cityList.value = []
  searchKeyword.value = ''
  searchMode.value = 'search'
  pageNum.value = 1
  pageSize.value = 20
  fetchHospitalData()
}

// 每页条数变化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  pageNum.value = 1
  if (searchMode.value === 'filter') {
    fetchHospitalDataByFilter()
  } else {
    fetchHospitalData()
  }
}

// 页码变化
const handleCurrentChange = (newPage) => {
  pageNum.value = newPage
  if (searchMode.value === 'filter') {
    fetchHospitalDataByFilter()
  } else {
    fetchHospitalData()
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchHospitalData()
})
</script>

<style scoped>
.hospital-data-page {
  padding: 20px;
}

/* 搜索栏样式 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-input {
  width: 320px;
}

.search-input :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  border-radius: 4px;
}

.search-input :deep(.el-input__inner) {
  height: 36px;
  line-height: 36px;
}

/* 筛选栏样式 */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-select {
  width: 180px;
}

/* 表格容器 */
.table-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 分页样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 表格样式优化 */
:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .search-bar,
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .filter-select {
    width: 100%;
  }
  
  .pagination-container {
    justify-content: center;
  }
}
</style>