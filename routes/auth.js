const express = require('express')
const router = express.Router()


const authentication = require('../middleware/authentication')
const testUser = require('../middleware/testUser')


const { register, login,updateUser } = require('../controllers/auth')

const rateLimiter = require('express-rate-limit');
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    msg: 'Too many requests from this IP, please try again after 15 minutes',
  },
});




router.post('/register', register);
router.post('/login', login);
router.patch('/updateUser', authentication, testUser,updateUser)
//router.patch('/updateUser', authentication,updateUser)
module.exports = router
