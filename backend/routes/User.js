const express = require("express")
const router = express.Router()
const { User } = require("../Models")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const JWT_SECRET = 'saltcode';
const validator = require('validator');
const { body, validationResult } = require('express-validator');

function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
        return res.status(400).json({ valid: false, message: `Password must be at least ${minLength} characters long.` });
    }
    if (!hasUpperCase) {
        return res.status(400).json({ valid: false, message: 'Password must contain at least one uppercase letter.' });
    }
    if (!hasLowerCase) {
        return res.status(400).json({ valid: false, message: 'Password must contain at least one lowercase letter.' });
    }
    if (!hasDigits) {
        return res.status(400).json({ valid: false, message: 'Password must contain at least one digit.' });
    }
    if (!hasSpecialChar) {
        return res.status(400).json({ valid: false, message: 'Password must contain at least one special character.' });
    }
    
     return { valid: true, message: 'Password is valid.' };
}





router.post("/signup", async (req, res) => {
    console.log("-------req",req)
    let success = false
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {

        const user = req.body
        const result = validatePassword(user.password);
        const salt = await bcrypt.genSalt(10)
        var secPass = await bcrypt.hash(user.password, salt)
        user.password = secPass
        const userIs = await User.create(user)
        const data = {
            user: { id: userIs.id }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authtoken: authtoken, userIs })

    } catch (error) {
        res.status(500).send("Internal Server Error")
    }

})


router.post("/login", [
    body("username", "Username must be atleast 4 characters").isLength({ min: 4 }),
    body("password", "Password must be atleast 8 characters").isLength({ min: 8 })
]
    , async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {

            let success = false
            const { username, password } = req.body
            let user = await User.findOne({ where: { username: username } })
            if(!user) {
                success = false
                return res.status(400).json({ success, error: "Invaild Details" })
            }
            const comparePassword = await bcrypt.compare(password, user.password)
            if (!comparePassword) {
                success = false
                return res.status(400).json({ success, error: "Invaild Password" })
            }
            const data = {
                user: { username: username, password: password }
            }
            // console.log("Your data is ", data.user)
            const authtoken = jwt.sign(data, JWT_SECRET)
            success = true
            user.password = undefined
            res.send({ success, authtoken, id: data.user.id, user })

        } catch (error) {
            console.log(error.message)
            res.status(500).send("Internal Server Error")
        }

    })



module.exports = router