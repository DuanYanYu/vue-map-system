// 在这里定义和用户相关的路由处理函数，供 /router/user.js模块进行调用
const db = require('../db/index')
const bcrypt = require('bcryptjs')
const { signToken, verifyToken } = require('../utils/token')

// 注册用户的处理函数
exports.regUser = (req, res)=>{
    const userInfo = req.query;
    
    if(!userInfo.username || !userInfo.password){
        return res.cc('用户名或密码不能为空！')
    }

    const sqlStr = 'select * from user where username = ?'

    db.query(sqlStr, userInfo.username, (err, results)=>{
        // 执行sql语句失败
        if(err){
           return res.cc(err)
        }
        // 判断用户名是否被占用
        if(results.length > 0){
            return res.cc('该用户名已被占用，请更换用户名！')
        }

        // 用户名可用
        // 密码加密
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)

        const sql = 'insert into user set ?'

        db.query(sql, {username: userInfo.username, password: userInfo.password}, (err, results)=>{
            // 执行sql语句失败
            if(err){
                return res.cc(err)
            }
            // 判断用户名是否被占用
            if(results.affectedRows !== 1){
                return res.cc('注册用户失败，请稍后重试！')
            }
            res.send({
                msg: '注册成功！',
                code: 20000,
                data:{}
            })
        })
    })
}

// 登录用户处理函数
exports.login = (req, res)=>{

    const userInfo = req.query

    const sql = 'select * from user where username = ?'

    db.query(sql, userInfo.username, function(err, results){
        if(err) return res.cc(err)

        if(results.length !==1) return res.cc('用户名或密码错误，登录失败')
        
        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)

        if(!compareResult){
            return res.cc('用户名或密码错误，登录失败')
        }

        const user = { roles: ['admin','editor'], name: results[0].username, password:'', avatar:'', introduction:'' }

        const tokenStr = signToken(user)

        // 将Token字符串响应给客户端
        res.send({
            msg: '登录成功！',
            code: 20000,
            data: {
                token: 'Bearer ' + tokenStr
            },
        })
        
    })

}

// 验证token获取用户信息处理函数
exports.getInfo = (req, res)=>{

    const token = req.query.token.replace(/Bearer /, '')
    const verifyResult = verifyToken(token)
    res.send({
        msg: 'token有效',
        code: 20000,
        data: {
            ...verifyResult
        },
    })
}