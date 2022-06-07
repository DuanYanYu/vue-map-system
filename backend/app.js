const express = require('express')
const joi = require('joi')
const config = require('./config')
const expressJWT = require('express-jwt') //解析token的中间件
const bodyParser=require('body-parser');

// 创建服务器实例
const app = express()

// 允许跨域
// 导入中间件
const cors = require('cors')
// 将cors注册为全局中间件
app.use(cors())

app.use(express.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({extended:true}));

// 响应数据的中间件
app.use((req, res, next)=>{
    // code = 20000为成功，code = 1 为失败，默认将code的值设置为1；
    res.cc = function(err, code = 1, data){
        res.send({
            // 状态
            msg: err instanceof Error? err.message:err,
            code,
            data,
        })
    }
    next()
})

// 使用 .unless({path: [/^\/api\//]}) 指定哪些接口不需要进行Token的身份验证
app.use(expressJWT({secret: config.jwtSecretKey}).unless({path: [/^\/api\//]}))


// 导入并使用Router
const userRouter = require('./router/user')
const geologicalRouter = require('./router/geological')
const echartsRouter = require('./router/echarts')
const mapRouter = require('./router/map')
app.use('/api', userRouter)
app.use('/', mapRouter)
app.use('/', geologicalRouter)
app.use('/', echartsRouter)


// 定义错误级别的中间件
app.use((err, req, res, next)=>{

    // 数据验证失败
    if(err instanceof joi.ValidationError) return res.cc(err)

    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

    //未知错误
    res.cc(err)
})

app.listen(3000, (req, res)=>{
    console.log('服务已启动 http://127.0.0.1:3000');
})