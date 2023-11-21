const router = require('express').Router()
const {Course, User} = require('../models')



//Route that returns a list of all courses and users associated with it

router.get('/courses', async (req, res, next) => {
    try {
        const courses = await Course.findAll({
            attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
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

router.get('/courses/:id', async (req, res, next) => {
    try {
        const course = await Course.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
            include: [
                {
                    model: User, 
                    as: 'user', 
                    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
                }
            ]
        })  
        
    if (!course) {
        return res.status(404).json({message: "Course not found"})
    }
        res.json(course) 
    } catch (error) {
        next(error)
    }
})

router.post('/courses', async (req, res, next) => {
    try {
        const newCourse = req.body
        console.log(newCourse);
       // newCourse.userId = req.currentUser.id
       const course = await Course.create(newCourse)
        res.status(201).location(`/courses/${course.id}`).end()
    } catch (error) {
        next(error)
    }
})

router.put('/courses/:id', async (req, res, next) => {
    try {
        await Course.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

router.delete('/courses/:id', async (req, res, next) => {
    try {
        await Course.destroy( {
            where: {
                id: req.params.id
            }
        })
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = router;