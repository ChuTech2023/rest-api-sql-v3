const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');



module.exports = async (req, res, next) => {
    let message;

    try {
        const credentials = auth(req);

        // if credentials exist
        if (credentials) {
            //Get user from database
            const user = await User.findOne({
                where: {
                    emailAddress: credentials.name
                }
            })

            //If user exist in the database
            if (user) {
                const validPassword = bcrypt.compareSync(credentials.pass, user.password)
                
                //If  entered password match saved password
                if (validPassword) {
                    req.currentUser = user
                } else {
                  message = "Authentication failed"  
                }
            } else {
                message = " User not found"
            }
        } else {
            message = "Athorization header not found"
        }
    } catch (error) {
        console.log(error);
        message = "Authentication Failed"
    }

    if (message) {
        res.status(401).json({message: "Access Denied" })
        return
    }
    next();
}