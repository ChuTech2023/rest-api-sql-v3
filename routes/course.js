const router = require('express').Router()
const { Course, User } = require('../models')
const auth = require('../middleware/auth')


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

//Get one course with its details
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
            return res.status(404).json({ message: "Course not found" })
        }
        res.json(course)
    } catch (error) {
        next(error)
    }
})

//create a course
router.post('/courses', auth, async (req, res, next) => {
    try {
        const newCourse = req.body
        console.log(newCourse);
        // newCourse.userId = req.currentUser.id
        const course = await Course.create(newCourse)
        res.status(201).location(`/courses/${course.id}`).end()
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map((e) => e.message)
            res.status(400).json({ errors })
        } else {
            next(error)
        }
    }
})

//update a course by ID
router.put('/courses/:id', auth, async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    try {
        if (req.currentUser.id != req.params.id) {
            res.status(403).json({ message: "Not Authorized" })
        }else{
            await course.update(req.body)
            res.status(204).end()
        }
        
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map((e) => e.message)
            res.status(400).json({ errors })
        } else {
            next(error)
        }
    }
})

//Delete a course by ID
router.delete('/courses/:id', auth, async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    try {
        if (req.currentUser.id != course.userId) {
            res.status(403).json({ message: "Not Authorized" })
        } else {
            await course.destroy()
            res.status(204).end()
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;