<template>
  <div class="main">
    <div class="nav-bar">
      <div class="button" :class="active===1? 'active': ''" @click="changeItem(1)">
        <el-image
          style="width: 70%; height: 70%"
          :src="icons[0]"
          fit="fill">
        </el-image>
        <div>数据图层</div>
      </div>
      <div class="button" @click="changeItem(2)">
        <el-image
          style="width: 70%; height: 70%"
          :src="icons[4]"
          fit="fill">
        </el-image>
        <div>底图图层</div>
      </div>
      <div class="button" @click="changeItem(3)">
        <el-image
          style="width: 70%; height: 70%"
          :src="icons[6]"
          fit="fill">
        </el-image>
        <div>工具条</div>
      </div>
    </div>
    <div class="box" v-show="active>0 && active<3">
      <div v-show="active === 1">
      <h3 style="text-align: center">选择数据展示的方式</h3>
        <el-radio-group v-model="dataShowWay">
          <el-radio label="marker">
            <el-image
              style="width: 80px; height: 80px"
              :src="icons[3]"
              fit="fill">
            </el-image>
            <div style="text-align: center">海量图</div> 
          </el-radio>
          <el-radio label="cluster">
            <el-image
              style="width: 90px; height: 80px"
              :src="icons[1]"
              fit="fill">
            </el-image>
            <div style="text-align: center">聚合图</div> 
          </el-radio>
          <el-radio label="heat" text-color="#ffab">
            <el-image
              style="width: 80px; height: 80px"
              :src="icons[2]"
              fit="fill">
            </el-image>
            <div style="text-align: center">热力图</div> 
          </el-radio>
        </el-radio-group>
      </div>
      <div v-show="active === 2">
        <h3 style="text-align: center">选择底图类别</h3>
        <el-radio-group v-model="baseType">
          <el-radio label="ColorMapEng">
            <el-image
              class="base-img"
              :src="layersImgs[0]"
              fit="fill">
            </el-image>
            <div style="text-align: center">中国地图彩色英文版</div> 
          </el-radio>
          <el-radio label="ChinaStreetGray">
            <el-image
              class="base-img"
              :src="layersImgs[1]"
              fit="fill">
            </el-image>
            <div style="text-align: center">中国地图灰色版</div> 
          </el-radio>
          <el-radio label="ChinaStreetPurplishBlue" text-color="#ffab">
            <el-image
              class="base-img"
              :src="layersImgs[2]"
              fit="fill">
            </el-image>
            <div style="text-align: center">中国地图蓝黑版</div> 
          </el-radio>
          <el-radio label="ChinaStreetWarm" text-color="#ffab">
            <el-image
              class="base-img"
              :src="layersImgs[3]"
              fit="fill">
            </el-image>
            <div style="text-align: center">中国地图暖色版</div> 
          </el-radio>
          <!-- <el-radio label="ColorMapEng" text-color="#ffab">
            <el-image
              class="base-img"
              :src="layersImgs[4]"
              fit="fill">
            </el-image>
            <div style="text-align: center">天地图</div> 
          </el-radio> -->
        </el-radio-group>
      </div>
    </div>
    <el-button class="back" icon="el-icon-back" @click="goBack">返回</el-button>
    <mc-gis m-width="100vw" m-height="100vh" :mZoom="zoom">
      <mc-base-layer :show="baseLayerVisible" :baseMapUrl="baseType"></mc-base-layer>
      <mc-heat :points="points" :show="heatLayerVisible"></mc-heat>
      <mc-marker :points="points" :icon="icon" :show="markerLayerVisible"></mc-marker>
      <mc-widget :show="widgetTool" @draw-complete="drawData"/>
      <mc-cluster :points="points" :icon="icon" :show="clusterLayerVisible"></mc-cluster>
    </mc-gis>
  </div>
</template>

<script>
import MapNavBar from '../components/MapNavBar';
import citys from '@/assets/js/citys_copy.js';

export default {
  name: 'MapBase',
  data() { // 可直接挂载到data数据上
    return {
      zoom: 4,
      points: citys,
      icon: require('@/assets/imgs/pointmarker.png'),
      Width: document.documentElement.clientWidth,
      Height: document.documentElement.clientHeight,
      baseLayerVisible: false,
      heatLayerVisible: false,
      markerLayerVisible: false,
      clusterLayerVisible: true,
      widgetTool: false,
      baseMapUrl: 'ChinaStreetPurplishBlue',
      active: 0,
      icons:[
        require('@/assets/imgs/map/datamap.png'),
        require('@/assets/imgs/map/clusterLayer.png'),
        require('@/assets/imgs/map/heatLayer.png'),
        require('@/assets/imgs/map/marker.png'),
        require('@/assets/imgs/map/layer.png'),
        require('@/assets/imgs/map/baseLayer.png'),
        require('@/assets/imgs/map/settings.png'),
      ],
      layersImgs:[
        require('@/assets/imgs/map/layer/ColorMapEng.png'),
        require('@/assets/imgs/map/layer/ChinaStreetGray.png'),
        require('@/assets/imgs/map/layer/ChinaStreetPurplishBlue.png'),
        require('@/assets/imgs/map/layer/ChinaStreetWarm.png'),
        // require('@/assets/imgs/map/layer/ColorMapEng.png'),
      ],
      dataShowWay: 'cluster', // 海量图展示方式
      baseType:'ChinaStreetPurplishBlue', //图层类别 
      drawData: []
    }
  },
  watch:{
    dataShowWay(val){
      if(val === 'marker'){
        this.markerLayerVisible = true;
        this.clusterLayerVisible = false;
        this.heatLayerVisible = false;
      }else if(val === 'cluster'){
        this.markerLayerVisible = false;
        this.clusterLayerVisible = true;
        this.heatLayerVisible = false;
      }else if(val === 'heat'){
        this.markerLayerVisible = false;
        this.clusterLayerVisible = false;
        this.heatLayerVisible = true;
      }else{
        this.markerLayerVisible = false;
        this.clusterLayerVisible = false;
        this.heatLayerVisible = false;
      }
    },
  },
  components:{MapNavBar},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    drawData(data){
      console.log(data);
      const points = data.data
      if (data.type === "polyline") {
        this.$prompt('信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的邮箱是: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      }
    },
    changeItem(type){
      switch (type) {
        case 1:
          this.active === 1? this.active = 0 : this.active = 1;
          break;
        case 2:
          this.active === 2? this.active = 0 : this.active = 2;
          break;
        case 3:
          this.active === 3? this.active = 0 : this.active = 3;
          this.widgetTool = !this.widgetTool
          break;
        case 4:
          this.active === 4? this.active = 0 : this.active = 4;
          break;
        default:
          break;
      }
    },
    changeVisibleHeatLayer(){
      this.active = 1;
    },
    changeVisibleMarkerLayer(){
      this.markerLayerVisible = !this.markerLayerVisible;
    },
    changeVisibleClusterLayer(){
      this.clusterLayerVisible = !this.clusterLayerVisible;
    },
  },
}
</script>
<style scoped>
.main {
  position: relative;
}
.back {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}
.nav-bar {
  position: absolute;
  padding: 2px;
  left: 5vw;
  top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  border-radius: 5px;
  z-index: 100;
  width: 70px;
  height: 33vh;
  background-color: #fefefe;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);

}
.icon {
  width: 100%;
  height: 10%;
}
.button {
  width: 100%;
  height: 70px;
  background-color: #D8D8D8;
  color: #2B2B2B;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}
.button:hover {
  background-color: #ACACAC;
  color: #2B2B2B;
}
.active {
  background-color: #ACACAC;
  color: #2B2B2B;
}
.base-img {
  margin-top: 20px;
  width: 160px; height: 100px;
}
.box {
  position: absolute;
  padding: 10px;
  left: calc(5vw + 75px); 
  top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  border-radius: 5px;
  z-index: 100;
  width: 450px;
  background-color: #fefefe;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}
</style>
