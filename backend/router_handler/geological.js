// 在这里定义和用户相关的路由处理函数，供 /router/geological.js模块进行调用
const db = require('../db/index')
const bcrypt = require('bcryptjs')

// 查询地质灾害处理函数
exports.getGeological = (req, res)=>{
    const pageInfo = {
        pageSize: parseInt(req.query.pageSize),
        pageNum: parseInt(req.query.pageNum)
    }
    const pageSize = pageInfo.pageSize?pageInfo.pageSize:10;
    const pageNum = pageInfo.pageNum?pageInfo.pageNum:1;
    const sqlStr = 'select * from geological ORDER BY date DESC limit ? offset ?'

    db.query(sqlStr, [pageSize, (pageNum-1)*pageSize], (err, results)=>{
        // 执行sql语句失败
        if(err){
           return res.cc(err)
        }

        const sql = 'select count(*) as total from geological'
        db.query(sql, (err, total)=>{
            if(err){
                return res.cc(err)
            }
            res.cc(
                '查询成功！',
                20000,
                {
                    total: total[0].total,
                    list: results,
                    next: pageNum+1,
                    prev: pageNum-1,
                    pageSize: pageSize,
                },
            )
        })

        
        
    })
}

// 根据ID查询地质灾害处理函数
exports.getGeologicalById = (req, res)=>{
    const geologicalId = req.query.geologicalId
    const sqlStr = 'select * from geological where geological_id = ?'

    db.query(sqlStr, geologicalId, (err, results)=>{
        // 执行sql语句失败
        if(err){
           return res.cc(err)
        }
        
        res.send({
            msg: '查询成功！',
            code: 20000,
            data: results[0],
        })
    })
}

// 保存地质灾害信息处理函数
exports.saveGeological = (req, res)=>{

    const geologicalInfo = req.query;

    const sql = 'insert into geological set ?'
    data = {
        date: geologicalInfo.date,
        type: geologicalInfo.type,
        lnglat: geologicalInfo.lnglat,
        severity: geologicalInfo.severity,
        address: geologicalInfo.address,
        people: geologicalInfo.people,
        money: geologicalInfo.money,
    }
    db.query(sql, data, (err, results)=>{
        // 执行sql语句失败
        if(err){
            return res.cc(err)
        }
        if(results.affectedRows !== 1){
            return res.cc('保存失败请重试！')
        }
        res.send({
            msg: '保存成功！',
            code: 20000,
            data: {},
        })
    })
}

// 更新地质灾害信息处理函数
exports.updateGeological = (req, res)=>{

    const geologicalInfo = req.query;

    const sql = 'update geological set ? where geological_id = ?'
    data = {
        date: geologicalInfo.date,
        type: geologicalInfo.type,
        latlng: geologicalInfo.latlng,
        severity: geologicalInfo.severity,
        address: geologicalInfo.address,
    }
    db.query(sql, [data, geologicalInfo.geologicalId], (err, results)=>{
        // 执行sql语句失败
        if(err){
            return res.cc(err)
        }
        if(results.affectedRows !== 1){
            return res.cc('保存失败请重试！')
        }
        res.send({
            msg: '更新成功！',
            code: 20000,
            data: {},
        })
    })
}

// 根据ID删除地质灾害信息处理函数
exports.deleteGeologicalById = (req, res)=>{

    const geologicalId = req.query.geologicalId;

    const sql = 'delete from geological where geological_id = ?'
    db.query(sql, geologicalId, (err, results)=>{
        // 执行sql语句失败
        if(err){
            return res.cc(err)
        }
        if(results.affectedRows !== 1){
            return res.cc('删除失败请重试！')
        }
        res.send({
            msg: '删除成功！',
            code: 20000,
            data: {},
        })
    })
}