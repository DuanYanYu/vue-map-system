const mysql = require('mysql')

const db = mysql.createPool({
    host: '110.42.166.71',
    user: 'root',
    password: 'dyy2466!@#',
    database: 'map_system'
})

// 向外共享数据库的连接对象
module.exports = db