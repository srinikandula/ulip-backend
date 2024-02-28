const express = require("express")
const router = express.Router()
const { User } = require("../Models")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const JWT_SECRET = 'saltcode';




router.post("/signup", async (req, res) => {
    try {

        const user = req.body
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


router.post("/login", async (req, res) => {
    try {

        let success = false
        const { username, password } = req.body
        let user = await User.findOne({ where: { username: username } })
        const comparePassword = await bcrypt.compare(password, user.password)
        // console.log(user)
        if (!comparePassword) {
            success = false
            return res.status(400).json({ success, error: "Please try with correct password" })
        }
        const data = {
            user: { username:username, password:password }
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