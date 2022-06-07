const jwt = require('jsonwebtoken')
const config = require('../config')

// 创建Token
const signToken = (user) => {
    // 私钥
    // 生成Token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: config.expiresIn,
    })
  // 将登陆的用户信息生成token，使用私钥进行非对称加密，过期时间为 2h
  return tokenStr
}

// 校验Token
const verifyToken = (token) => {
    // 公钥
    // 根据公钥验证token
    // 验证成功则返回注册token的原始信息
    try {
        return jwt.verify(token, config.jwtSecretKey)
    } catch (error) {
        return null
    }
 
}

module.exports = {
  signToken,
  verifyToken,
}
