<template>
  <div class="map-container">
    <div ref="mapRef" class="map-chart"></div>
    <el-dialog v-model="hospitalDialogVisible" :title="`${currentCity} 有代理商的医院`" width="600px">
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
    async loadChinaMap() {
      try {
        const response = await fetch("https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json");
        this.chinaJson = await response.json();
        echarts.registerMap("china", this.chinaJson);
      } catch (error) {
        console.error("加载中国地图失败:", error);
      }
    },
    async loadProvinceMap(provinceName) {
      try {
        const adcode = this.getProvinceAdcode(provinceName);
        if (!adcode) {
          console.error("未找到省份编码:", provinceName);
          return;
        }
        const response = await fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`);
        this.provinceJson = await response.json();
        echarts.registerMap(provinceName, this.provinceJson);
      } catch (error) {
        console.error("加载省份地图失败:", error);
      }
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
          text: "全国代理商分布",
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
          roam: false,
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
          text: `${this.currentProvince} 代理商分布`,
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
          roam: false,
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
  height: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
