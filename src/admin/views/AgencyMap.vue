<template>
  <div class="map-container">
    <div ref="mapRef" class="map-chart"></div>
    <el-dialog v-model="hospitalDialogVisible" :title="`${currentCity} 有服务布局的医院`" width="600px">
      <el-table :data="hospitals" style="width: 100%">
        <el-table-column prop="hospitalName" label="医院名称" width="200" />
        <el-table-column prop="hospitalLevel" label="医院等级" width="100" />
        <el-table-column prop="districtCounty" label="区县" />
      </el-table>
      <template #footer>
        <el-button @click="hospitalDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    <el-button v-if="mapLevel !== 'province'" class="back-btn" type="primary" size="small" @click="goBack"> 返回全国地图 </el-button>
  </div>
</template>

<script>
import * as echarts from "echarts";
import request from "@/utils/request";
import chinaMapJson from '@/assets/maps/china-map.json';

export default {
  name: "AgencyMap",
  data() {
    return {
      mapChart: null,
      mapLevel: "province",
      currentProvince: "",
      currentCity: "",
      provincesWithAgency: [],
      citiesWithAgency: [],
      hospitals: [],
      hospitalDialogVisible: false,
      chinaJson: null,
      provinceJson: null,
    };
  },
  mounted() {
    this.initMap();
  },
  beforeUnmount() {
    if (this.mapChart) {
      this.mapChart.dispose();
    }
  },
  methods: {
    async initMap() {
      await this.fetchProvincesWithAgency();
      await this.loadChinaMap();
      this.initChart();
    },
    async fetchProvincesWithAgency() {
      try {
        const res = await request.get("/admin/hospital/provinces");
        this.provincesWithAgency = res.data || [];
      } catch (error) {
        console.error("获取省份列表失败:", error);
        this.provincesWithAgency = [];
      }
    },
    loadChinaMap() {
      // 使用 import 导入的地图数据，无需异步加载
      this.chinaJson = chinaMapJson;
      echarts.registerMap("china", this.chinaJson);
    },
    async loadProvinceMap(provinceName) {
      try {
        // 将省份名称转换为小写拼音文件名
        const provinceFileName = this.getProvinceFileName(provinceName);
        if (!provinceFileName) {
          console.error(`未找到 ${provinceName} 对应的地图文件`);
          return;
        }
        
        // 从本地加载省份地图数据
        try {
          const module = await import(`@/assets/maps/provinces/${provinceFileName}.json`);
          this.provinceJson = module.default;
          echarts.registerMap(provinceName, this.provinceJson);
        } catch (importError) {
          console.warn(`加载${provinceName}地图文件失败，使用全国地图:`, importError);
          throw importError;
        }
      } catch (error) {
        console.error("加载省份地图异常:", error);
      }
    },
    getProvinceFileName(provinceName) {
      // 省份名称到文件名的映射（小写拼音）
      const provinceFileMap = {
        北京市: 'beijing',
        天津市: 'tianjin',
        河北省: 'hebei',
        山西省: 'shanxi',
        内蒙古自治区: 'neimenggu',
        辽宁省: 'liaoning',
        吉林省: 'jilin',
        黑龙江省: 'heilongjiang',
        上海市: 'shanghai',
        江苏省: 'jiangsu',
        浙江省: 'zhejiang',
        安徽省: 'anhui',
        福建省: 'fujian',
        江西省: 'jiangxi',
        山东省: 'shandong',
        河南省: 'henan',
        湖北省: 'hubei',
        湖南省: 'hunan',
        广东省: 'guangdong',
        广西壮族自治区: 'guangxi',
        海南省: 'hainan',
        重庆市: 'chongqing',
        四川省: 'sichuan',
        贵州省: 'guizhou',
        云南省: 'yunnan',
        西藏自治区: 'xizang',
        陕西省: 'shaanxi',
        甘肃省: 'gansu',
        青海省: 'qinghai',
        宁夏回族自治区: 'ningxia',
        新疆维吾尔自治区: 'xinjiang',
        台湾省: 'taiwan',
        香港特别行政区: 'xianggang',
        澳门特别行政区: 'aomen',
      };
      return provinceFileMap[provinceName] || null;
    },
    getProvinceAdcode(provinceName) {
      const provinceAdcodes = {
        北京市: "110000",
        天津市: "120000",
        河北省: "130000",
        山西省: "140000",
        内蒙古自治区: "150000",
        辽宁省: "210000",
        吉林省: "220000",
        黑龙江省: "230000",
        上海市: "310000",
        江苏省: "320000",
        浙江省: "330000",
        安徽省: "340000",
        福建省: "350000",
        江西省: "360000",
        山东省: "370000",
        河南省: "410000",
        湖北省: "420000",
        湖南省: "430000",
        广东省: "440000",
        广西壮族自治区: "450000",
        海南省: "460000",
        重庆市: "500000",
        四川省: "510000",
        贵州省: "520000",
        云南省: "530000",
        西藏自治区: "540000",
        陕西省: "610000",
        甘肃省: "620000",
        青海省: "630000",
        宁夏回族自治区: "640000",
        新疆维吾尔自治区: "650000",
        台湾省: "710000",
        香港特别行政区: "810000",
        澳门特别行政区: "820000",
      };
      return provinceAdcodes[provinceName] || null;
    },
    getProvinceCenter(provinceName) {
      // 各省份中心点坐标
      const provinceCenters = {
        北京市: [116.4074, 39.9042],
        天津市: [117.2009, 39.0842],
        河北省: [114.5149, 38.0428],
        山西省: [112.5492, 37.857],
        内蒙古自治区: [111.6708, 40.8184],
        辽宁省: [123.4315, 41.8057],
        吉林省: [125.324, 43.8168],
        黑龙江省: [126.6424, 45.7569],
        上海市: [121.4737, 31.2304],
        江苏省: [118.7674, 32.0415],
        浙江省: [120.1551, 30.2741],
        安徽省: [117.283, 31.8612],
        福建省: [119.2965, 26.0745],
        江西省: [115.8922, 28.6765],
        山东省: [117.02, 36.6758],
        河南省: [113.65, 34.7668],
        湖北省: [114.3055, 30.5928],
        湖南省: [112.9822, 28.1941],
        广东省: [113.2644, 23.1291],
        广西壮族自治区: [108.32, 22.8241],
        海南省: [110.3311, 20.0319],
        重庆市: [106.55, 29.5633],
        四川省: [104.0665, 30.5723],
        贵州省: [106.7135, 26.5783],
        云南省: [102.7122, 25.0406],
        西藏自治区: [91.1322, 29.6603],
        陕西省: [108.9402, 34.3416],
        甘肃省: [103.8235, 36.058],
        青海省: [101.7783, 36.6232],
        宁夏回族自治区: [106.258, 38.4668],
        新疆维吾尔自治区: [87.6168, 43.7928],
      };
      return provinceCenters[provinceName] || [104.1954, 35.8617]; // 默认中国中心点
    },
    initChart() {
      if (!this.$refs.mapRef) return;

      this.mapChart = echarts.init(this.$refs.mapRef);

      this.mapChart.on("click", this.handleMapClick);

      window.addEventListener("resize", this.handleResize);

      this.renderProvinceMap();
    },
    async renderProvinceMap() {
      const data = this.provincesWithAgency.map((province) => ({
        name: province,
        value: 1,
      }));

      const option = {
        title: {
          text: "全国服务布局地图",
          left: "center",
          textStyle: {
            color: "#333",
            fontSize: 20,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}",
        },
        visualMap: {
          show: false,
          min: 0,
          max: 1,
          inRange: {
            color: ["#d0d0d0", "#409EFF"],
          },
        },
        geo: {
          map: "china",
          roam: true,
          center: [108, 35], // 往左上偏移
          zoom: 1.5, // 放大1.5倍
          label: {
            show: true,
            fontSize: 10,
            color: "#333",
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
            areaColor: "#d0d0d0",
          },
          emphasis: {
            itemStyle: {
              areaColor: "#66b1ff",
            },
            label: {
              color: "#fff",
            },
          },
          // 隐藏南海诸岛、香港、澳门特别行政区的显示和交互
          regions: [
            {
              name: "南海诸岛",
              itemStyle: {
                areaColor: "transparent",
                borderColor: "transparent",
                opacity: 0,
              },
              label: {
                show: false,
              },
              emphasis: {
                itemStyle: {
                  areaColor: "transparent",
                  borderColor: "transparent",
                },
                label: {
                  show: false,
                },
              },
            },
            {
              name: "香港特别行政区",
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                },
              },
            },
            {
              name: "澳门特别行政区",
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                },
              },
            },
          ],
        },
        series: [
          {
            name: "代理商",
            type: "map",
            map: "china",
            geoIndex: 0,
            data: data,
          },
        ],
      };

      this.mapChart.setOption(option);
    },
    async handleMapClick(params) {
      // 排除南海诸岛、香港、澳门和台湾，使其不可点击
      const excludedAreas = ["南海诸岛", "香港特别行政区", "澳门特别行政区", "台湾省"];
      if (excludedAreas.includes(params.name)) {
        return;
      }

      if (this.mapLevel === "province") {
        await this.handleProvinceClick(params.name);
      } else if (this.mapLevel === "city") {
        await this.handleCityClick(params.name);
      }
    },
    async handleProvinceClick(provinceName) {
      this.currentProvince = provinceName;
      await this.loadProvinceMap(provinceName);
      await this.fetchCitiesWithAgency(provinceName);
      this.mapLevel = "city";
      // 重置地图状态，确保进入省份地图时缩放状态重置
      this.mapChart.dispatchAction({
        type: "restore",
      });
      this.renderCityMap();
    },
    async fetchCitiesWithAgency(province) {
      try {
        const res = await request.get(`/admin/hospital/cities/${province}`);
        this.citiesWithAgency = res.data || [];
      } catch (error) {
        console.error("获取城市列表失败:", error);
        this.citiesWithAgency = [];
      }
    },
    async renderCityMap() {
      const data = this.citiesWithAgency.map((city) => ({
        name: city,
        value: 1,
      }));

      const option = {
        title: {
          text: `${this.currentProvince} 服务布局地图`,
          left: "center",
          textStyle: {
            color: "#333",
            fontSize: 20,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}",
        },
        visualMap: {
          show: false,
          min: 0,
          max: 1,
          inRange: {
            color: ["#d0d0d0", "#409EFF"],
          },
        },
        geo: {
          map: this.currentProvince,
          roam: true,
          center: this.getProvinceCenter(this.currentProvince),
          label: {
            show: true,
            fontSize: 10,
            color: "#333",
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
            areaColor: "#d0d0d0",
          },
          emphasis: {
            itemStyle: {
              areaColor: "#66b1ff",
            },
            label: {
              color: "#fff",
            },
          },
          // 隐藏南海诸岛（如果是海南省地图）
          regions: [
            {
              name: "南海诸岛",
              itemStyle: {
                areaColor: "transparent",
                borderColor: "transparent",
                opacity: 0,
              },
              emphasis: {
                itemStyle: {
                  areaColor: "transparent",
                  borderColor: "transparent",
                },
              },
            },
          ],
        },
        series: [
          {
            name: "代理商",
            type: "map",
            map: this.currentProvince,
            geoIndex: 0,
            data: data,
          },
        ],
      };

      // 修复海南省地图显示问题
      if (this.currentProvince === "海南省") {
        option.geo.center = [109.844902, 19.0392]; // 中心位置
        option.geo.layoutCenter = ["50%", "40%"]; // 地图相对容器偏移
        option.geo.layoutSize = "380%"; // 地图放大比例
      }

      this.mapChart.setOption(option);
    },
    async handleCityClick(cityName) {
      this.currentCity = cityName;
      await this.fetchHospitals(cityName);
      this.hospitalDialogVisible = true;
    },
    async fetchHospitals(city) {
      try {
        const res = await request.get(`/admin/hospital/hospitals/${city}`);
        this.hospitals = res.data || [];
      } catch (error) {
        console.error("获取医院列表失败:", error);
        this.hospitals = [];
      }
    },
    goBack() {
      this.mapLevel = "province";
      this.currentProvince = "";
      this.currentCity = "";
      // 重置地图状态，确保回到全国地图时回正
      this.mapChart.dispatchAction({
        type: "restore",
      });
      this.renderProvinceMap();
    },
    handleResize() {
      if (this.mapChart) {
        this.mapChart.resize();
      }
    },
  },
};
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
}

.map-chart {
  width: 100%;
  height: 100%;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}
</style>
