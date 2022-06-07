const express = require('express')

// 创建路由对象
const router = express.Router()

const echartsHandler = require('../router_handler/echarts')

// 灾害类型饼图数据
router.get('/echarts/getGeologicalHazard',  echartsHandler.getGeologicalHazard)

// 严重程度饼图数据
router.get('/echarts/getGeologicalSeverity',  echartsHandler.getGeologicalSeverity)

// 各年份严重程度饼图数据
router.get('/echarts/getGeologicalHazardEveryYear',  echartsHandler.getGeologicalHazardEveryYear)

// 统计数据
router.get('/echarts/getGeologicalHazardStatistics',  echartsHandler.getGeologicalHazardStatistics)

// 各年份各类别折线图
router.get('/echarts/getGeologicalHazardEveryYearType',  echartsHandler.getGeologicalHazardEveryYearType)

// 将路由对象共享
module.exports = router