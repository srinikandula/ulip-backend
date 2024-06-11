const express = require("express")
const router = express.Router()
const { User } = require("../Models")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const JWT_SECRET = 'saltcode';
const { body, validationResult } = require('express-validator');



router.post("/signup", [
    body("username", "Username must be atleast 4 characters").isLength({ min: 4 }),
    body("name", "Name Must be atleast 1 character").isLength({ min: 1 }),
    body("password", "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one special character").isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/, "i"),
    body("contactNo", "Contact Number must be atleast 10 characters").isLength({ min: 10 }),
    body("email", "Must be a email").isEmail()
], async (req, res) => {
    let success = false
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const emailCheck = await User.findOne({ where: { email: req.body.email } });
        if (emailCheck) {
            return res.status(400).json({ success: false, message: "Email already Exisit" });
        }

        const phoneCheck = await User.findOne({ where: { contactNo: req.body.contactNo } });
        if (phoneCheck) {
            return res.status(400).json({ success: false, message: "contact number already Exisit" });
        }
        const userNameCheck = await User.findOne({ where: { username: req.body.username } });
        if (userNameCheck) {
            return res.status(400).json({ success: false, message: "user Name already Exisit" });
        }
        const user = req.body
        const salt = await bcrypt.genSalt(10)
        var secPass = await bcrypt.hash(user.password, salt)
        user.password = secPass
        user.status="InActive"
        const userIs = await User.create(user)
        const data = {
            user: { id: userIs.id }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        return res.json({ success: true, authtoken: authtoken, userIs })

    } catch (error) {
        console.log(error,'============errrr')
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
            if(user.status==='InActive'||user.status===''){
             return res.status(400).json({ success: false, message: "You'r InActive please contact Admin" });
            }
            const comparePassword = await bcrypt.compare(password, user.password)
            // console.log(user)
            if (!comparePassword) {
                success = false
                return res.status(400).json({ success, error: "Please try with correct password" })
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

    router.get('/getUserData',async(req,res)=>{
        try {
            const userData = await User.findAll()
            if(userData){
                return res.status(200).json({ message: "get User Data Successfully",userData });
            }else{
                return res.status(200).json({ message: "User Data Empty",userData });

            }
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });

        }
    })

    router.post('/access/:username', async (req, res) => {
        const { username } = req.params;
        const { roleName, roleId } = req.body;
    
        try {
            // Find the user by username
            const user = await User.findOne({ where: { username } });
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Update the user's status, roleName, and roleId
            user.status = 'Active';
            user.roleName = roleName;
            user.roleId = roleId;
    
            // Save the updated user to the database
            await user.save();
    
            return res.status(200).json({ message: "User access updated successfully" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });
    



module.exports = router