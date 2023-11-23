
const router = require('express').Router()
const { User } = require('../models');
const bcryptjs = require('bcrypt');
const auth = require('../middleware/auth')

// route that returns all properties and values for the currently authenticated User along with a 200 HTTP status code
router.get('/users', auth, async (req,res, next) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.currentUser.id
            },
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        })
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
})

//route for creating a user
router.post('/users', async (req, res, next) => {
    try {
        const newUser = req.body;
        await User.create(newUser);
        res.status(201).location('/').end();
    } catch (error) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            const errors = error.errors.map( (e) => e.message)
            res.status(400).json({errors})
         } else {
             next(error)
         }
    }
} )


module.exports = router;