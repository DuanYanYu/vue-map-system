// 在这里定义和地图相关的路由处理函数，供 /router/echarts.js模块进行调用
const db = require('../db/index')
const bcrypt = require('bcryptjs')

// 灾害类型饼图数据
exports.getAllPoints = (req, res)=>{
    
    const sqlStr = 'SELECT type, severity, lnglat, address FROM geological'

    db.query(sqlStr, (err, results)=>{
        // 执行sql语句失败
        if(err){
           return res.cc(err)
        }

        results.filter(item=>{
            item.lnglat = item.lnglat.split(',')
        })

        res.send({
            msg: '查询成功！',
            code: 20000,
            data: results,
        })
    })
}