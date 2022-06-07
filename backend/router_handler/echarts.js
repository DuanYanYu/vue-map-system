// 在这里定义和用户相关的路由处理函数，供 /router/echarts.js模块进行调用
const db = require('../db/index')
const bcrypt = require('bcryptjs')

// 灾害类型饼图数据
exports.getGeologicalHazard = (req, res)=>{
    
    const sqlStr = 'SELECT type, count(`type`) num FROM geological GROUP BY type'

    db.query(sqlStr, (err, results)=>{
        // 执行sql语句失败
        if(err){
           return res.cc(err)
        }

        res.send({
            msg: '查询成功！',
            code: 20000,
            data: results,
        })
    })
}

// 严重程度饼图数据
exports.getGeologicalSeverity = (req, res)=>{
    
    const sqlStr = 'SELECT severity, count(`severity`) num FROM geological GROUP BY severity'

    db.query(sqlStr, (err, results)=>{
        // 执行sql语句失败
        if(err){
           return res.cc(err)
        }

        res.send({
            msg: '查询成功！',
            code: 20000,
            data: results,
        })
    })
}

// 统计数据
exports.getGeologicalHazardStatistics = (req, res)=>{
    
    // 今年较去年灾害增长率
    new Promise((resolve, reject)=>{
        const sqlStr = 'SELECT getStatistics() growthRate'
        db.query(sqlStr, (err, results)=>{
            // 执行sql语句失败
            if(err){
                reject(err)
                return res.cc(err)
            }
            let growthRate = results[0].growthRate
            let data = {
                growthRate
            }
            resolve(data)
        }) 
    }).then((data)=>{
        
        // 灾害总数
        return new Promise((resolve, reject)=>{
            const countSqlStr = 'SELECT count(*) count from geological'

            db.query(countSqlStr, (err, results)=>{
                if(err){
                    reject(err)
                    return res.cc(err)
                }
                data.count =  results[0].count
                resolve(data)
            })  
        })
    }).then((data)=>{
        
        // 伤亡人数
        return new Promise((resolve, reject)=>{
            const peopleSqlStr = 'SELECT SUM(people) people FROM geological'

            db.query(peopleSqlStr, (err, results)=>{
                if(err){
                    reject(err)
                    return res.cc(err)
                }
                data.people =  results[0].people
                resolve(data)
            })  
        })
    }).then((data)=>{
        
        // 损失资金
        return new Promise((resolve, reject)=>{
            const moneySqlStr = 'SELECT SUM(money) money FROM geological'

            db.query(moneySqlStr, (err, results)=>{
                if(err){
                    reject(err)
                    return res.cc(err)
                }
                data.money =  results[0].money
                resolve(data)
            })  
        })
    }).then((data)=>{
        res.send({
            msg: '查询成功！',
            code: 20000,
            data: data,
        })
    }).
    catch((err)=>{
        return res.cc(err)
    })
}

// 各年份各类别折线图
exports.getGeologicalHazardEveryYearType = (req, res)=>{
    
    const sqlStr = "select DATE_FORMAT(date, '%Y') year, type, count(type) sum FROM geological GROUP BY DATE_FORMAT(date, '%Y'), type"

    db.query(sqlStr, (err, results)=>{
        // 执行sql语句失败
        if(err){
           return res.cc(err)
        }
        
        res.send({
            msg: '查询成功！',
            code: 20000,
            data: results,
        })
    })
}


// 各年份灾害类型折线图数据
exports.getGeologicalHazardEveryYear = (req, res)=>{
    
    const sqlStr = 'SELECT severity, count(`severity`) num FROM geological GROUP BY severity'

    db.query(sqlStr, (err, results)=>{
        // 执行sql语句失败
        if(err){
           return res.cc(err)
        }

        res.send({
            msg: '查询成功！',
            code: 20000,
            data: results,
        })
    })
}