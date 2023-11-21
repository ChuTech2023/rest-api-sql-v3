
const router = require('express').Router()
const { User } = require('../models');
const bcrypt = require('bcrypt');

// route that returns all properties and values for the currently authenticated User along with a 200 HTTP status code
router.get('/users', async (req,res, next) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.currentUser.id
            },
            attributes: ['id', 'firstNmae', 'lastName', 'emailAddress']
        })
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
})

router.post('/users', async (req, res, next) => {
    try {
        const newUser = req.body
        newUser.password = bcrypt.hashSync(newUser.password, 10)
        await User.create(newUser)
        res.status(201).location('/').end();
    } catch (error) {
        console.log(error.name)
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            const errors = error.errors.map( (e) => e.message)
            res.status(400).json({errors})
         } else {
             next(error)
         }
    }
} )


module.exports = router;