const router = require('express').Router()
const users = require('./user')
const courses = require('./course')

router.use(users)
router.use(courses)


module.exports = router;