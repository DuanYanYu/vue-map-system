const express = require('express')

// 创建路由对象
const router = express.Router()

const mapHandler = require('../router_handler/map')

// 获取海量点数据
router.get('/map/getAllPoints',  mapHandler.getAllPoints)

// 将路由对象共享
module.exports = router