<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <!-- <line-chart :chart-data="lineChartData" /> -->
      <div id="lineChartDom" style="height: 360px"></div>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="7">
        <div class="chart-wrapper">
          <div id="hazardChartDom" style="width: 100%; height: 360px"></div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="10">
        <div class="chart-wrapper">
          <mc-gis :mHeight="360" mWidth="100%">
            <mc-heat :points="points"></mc-heat>
          </mc-gis>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="7">
        <div class="chart-wrapper">
          <div id="serverityChartDom" style="width: 100%; height: 360px"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";
import citys from '@/assets/js/citys_copy.js';
import { getGeologicalHazard, getGeologicalSeverity, getGeologicalHazardEveryYearType } from "@/api/echarts";
import { getAllPoints } from "@/api/map";
import GithubCorner from "@/components/GithubCorner";
import PanelGroup from "./components/PanelGroup";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

export default {
  name: "DashboardAdmin",
  components: {
    GithubCorner,
    PanelGroup,
  },
  data() {
    return {
      severityData: [],
      hazardData: [],
      points: citys,
      lineChartData: {
        type: ["泥石流灾", "地裂缝灾", "地面沉降", "山体滑坡", "崩塌灾害", "地面塌陷"],
        years: ["2018", "2019", "2020", "2021", "2022"],
        data:[{
          type:'',
          data:[]
        }]
      },
    };
  },
  created() {
    this.getHazardData();
    this.getSeverityData();
    this.getEveryYearTypeData()
    this.initPoints();
    this.$nextTick(() => {
      this.updateLineChart()
    });
  },
  methods: {
    getSeverityData() {
      getGeologicalSeverity().then((res) => {
        this.severityData = res.data.map((item) => {
          return {
            name: item.severity,
            value: item.num,
          };
        });
        this.severityData.sort((a, b) => {
          return a.value - b.value;
        });
        this.updateServerityChart();
      });
    },
    updateServerityChart() {
      let serverityChartDom = document.getElementById("serverityChartDom");
      let myChart = echarts.init(serverityChartDom);
      myChart.clear();
      const option = {
        title: {
          text: "地质灾害严重程度占比",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "bottom",
          left: "center",
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true },
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} 处 ({d}%)",
        },
        series: [
          {
            name: "严重程度数量及占比",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.severityData,
          },
        ],
      };

      option && myChart.setOption(option);
    },
    getHazardData() {
      getGeologicalHazard().then((res) => {
        this.hazardData = res.data.map((item) => {
          return {
            name: item.type,
            value: item.num,
          };
        });
        this.hazardData.sort((a, b) => {
          return a.value - b.value;
        });
        this.updateHazardChart();
      });
    },
    getEveryYearTypeData(){
      getGeologicalHazardEveryYearType().then((res) => {
        let allData = []
        for(let i in this.lineChartData.type){
          let data = []
          for(let j in res.data){
            if(res.data[j].type === this.lineChartData.type[i] && res.data[j].year==="2019"){
              data[0] = res.data[j].sum
            }
            if(res.data[j].type === this.lineChartData.type[i] && res.data[j].year==="2020"){
              data[1] = res.data[j].sum
            }
            if(res.data[j].type === this.lineChartData.type[i] && res.data[j].year==="2021"){
              data[2] = res.data[j].sum
            }
            if(res.data[j].type === this.lineChartData.type[i] && res.data[j].year==="2022"){
              data[3] = res.data[j].sum
            }
          }
          console.log(i, data);
          allData.push({
            type:this.lineChartData.type[i],
            data:data
          })
        }
        this.lineChartData.data = allData
        console.log(this.lineChartData);
        this.$nextTick(()=>{
          this.updateLineChart()
        })
      });
    },
    updateHazardChart() {
      let serverityChartDom = document.getElementById("hazardChartDom");
      let myChart = echarts.init(serverityChartDom);
      myChart.clear();
      const option = {
        title: {
          text: "地质灾害类别占比",
        },
        legend: {
          top: "bottom",
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true },
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} 处 ({d}%)",
        },
        series: [
          {
            name: "灾害数量及占比",
            type: "pie",
            radius: [20, 100],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            data: this.hazardData,
          },
        ],
      };

      option && myChart.setOption(option);
    },
    updateLineChart() {
      let lineChartDom = document.getElementById("lineChartDom");
      let myChart = echarts.init(lineChartDom);
      myChart.clear();
      let series = []
      for (let i = 0; i < this.lineChartData.data.length; i++) {
        series.push({
          name: this.lineChartData.data[i].type,
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: this.lineChartData.data[i].data,
        })
      }
      
      const option = {
        title: {
          text: "各年度灾害类别数量变化趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["泥石流灾", "地裂缝灾", "地面沉降", "山体滑坡", "崩塌灾害"],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["2019", "2020", "2021", "2022"],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series,
      };

      option && myChart.setOption(option);
    },
    initPoints(){
      getAllPoints().then((res) => {
        this.points = res.data.map((item) => {
          return {
            'lnglat':item.lnglat
          }
        })
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
