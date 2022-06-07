const express = require('express')

// 创建路由对象
const router = express.Router()

const geologicalHandler = require('../router_handler/geological')

// 分页查询
router.post('/geological/get',  geologicalHandler.getGeological)

// 保存
router.post('/geological/save',  geologicalHandler.saveGeological)

// 通过id查询
router.post('/geological/getById',  geologicalHandler.getGeologicalById)

// 通过id更新
router.post('/geological/update',  geologicalHandler.updateGeological)

// 通过id删除
router.post('/geological/delete',  geologicalHandler.deleteGeologicalById)

// 将路由对象共享
module.exports = router