const router = require('express').Router()
const {Course, User} = require('../models')



//Route that returns a list of all courses and users associated with it

router.get('/courses', async (req, res, next) => {
    try {
        const courses = await Course.findAll({
            attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded'],
            include: [
                {
                    model: User, 
                    as: 'user', 
                    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
                }
            ]
        })   
        res.json(courses) 
    } catch (error) {
        next(error)
    }
})


module.exports = router;