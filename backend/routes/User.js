const express = require("express")
const router = express.Router()
const { User } = require("../Models")
const { userAuth } = require("../Models")
var fetchuser = require("../middleware/fetchuser")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const emailService = require('../emailService/mailer')
const JWT_SECRET = 'saltcode';
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const CryptoJS = require("crypto-js");


function generateRandomPassword(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$&";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

async function forgotPasswordemailOTPGenerate(userObj, done) {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        if (OTP) {
            const now = new Date();
            const expirationTime = new Date(now.getTime() + 5 * 60000);
            const data = {
                userId: userObj.id,
                emailOtp: OTP,
                expiresIn: expirationTime,
                status: 'active',
            };

            const userAuthDetails = await userAuth.findOne({where: {email: userObj.email}});
            if (userAuthDetails) {
                let result = await userAuth.update({
                    emailOtp: OTP,
                    expiresIn: expirationTime,
                    status: 'active',
                }, {where: {userId: userObj.id}});
                if (result) {
                    await emailService.otpGenerationForForgotPassword(userObj, OTP, done);
                    return OTP;

                } else {
                    return done(null, false);
                }
            } else {
                let result = await userAuth.create(data);
                if (result) {
                    await emailService.otpGenerationForForgotPassword(userObj, OTP, done);
                    return OTP;

                } else {
                    return done(null, false);
                }
            }
        }
    } catch (e) {
        console.log(e)
        done({
            status: 400,
            message: e,
        });
    }
}

router.post("/signup", [
    body("username", "Username must be atleast 4 characters").isLength({ min: 4 }),
    body('tokenId').isNumeric().withMessage('Token Id must be a number').isInt({ min: 3 }).withMessage('Token Id must be at least 3'),
    // body("contactNo", "Contact Number must be atleast 10 characters").isNumeric().withMessage('contactNo must be a Number').isInt({ min: 10 }).withMessage('ContactNo must be at 10 Numbers'),
    // body("email", "Must be a email").isEmail()
], async (req, res) => {
    let success = false
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const indianPhoneNumberPattern = /^[6789]\d{9}$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const bytesEmail= CryptoJS.AES.decrypt(req.body.email, process.env.secretKey);
        const decryptedEmail = bytesEmail.toString(CryptoJS.enc.Utf8);
        const bytesPhone= CryptoJS.AES.decrypt(req.body.contactNo, process.env.secretKey);
        const decryptedPhone = bytesPhone.toString(CryptoJS.enc.Utf8); 
        const bytesPass = CryptoJS.AES.decrypt(req.body.password, process.env.secretKey);
        const decryptedPassword = bytesPass.toString(CryptoJS.enc.Utf8);
        const bytesConPass = CryptoJS.AES.decrypt(req.body.conformpassword, process.env.secretKey);
        const decryptedConPassword = bytesConPass.toString(CryptoJS.enc.Utf8);
        if (!emailPattern.test(decryptedEmail)) {
            return res.status(400).json({
              message: 'Please Enter Vaild Email'
            });
          }
          if (!indianPhoneNumberPattern.test(decryptedPhone)) {
            return res.status(400).json({
              message: 'Please enter a valid Indian phone number'
            });
          }
        if (!decryptedPassword || decryptedPassword.length < 8 || !decryptedPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/)) {
            return res.status(400).json({
              message: 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one special character.'
            });
          }
        if(decryptedPassword != decryptedConPassword){
        return res.status(400).json({ success: false, message: "Mismatch the password" });

        }
        const emailCheck = await User.findOne({ where: { email: decryptedEmail } });
        if (emailCheck) {
            return res.status(400).json({ success: false, message: "Email already Exist" });
        }
        const phoneCheck = await User.findOne({ where: { contactNo: decryptedPhone } });
        if (phoneCheck) {
            return res.status(400).json({ success: false, message: "contact number already Exist" });
        }
        const userNameCheck = await User.findOne({ where: { username: req.body.username } });
        if (userNameCheck) {
            return res.status(400).json({ success: false, message: "user Name already Exist" });
        }
        const tokenCheck = await User.findOne({ where: { tokenId: req.body.tokenId } });
        if (tokenCheck) {
            return res.status(400).json({ success: false, message: "Token Id already Exist" });
        }
        const user = req.body
        const salt = await bcrypt.genSalt(10)
        var secPass = await bcrypt.hash(decryptedPassword, salt)
        // user.password = secPass
        // user.passW = decryptedPassword
        // user.status="InActive"
        // user.roleName="User"
        // user.roleId=2
        const obj ={
            email: decryptedEmail,
            contactNo: decryptedPhone,
            username: req.body.username,
            tokenId: req.body.tokenId,
            password:secPass,
            passW:decryptedPassword,
            status:"InActive",
            roleName:"User",
            roleId:2
        }
        const userIs = await User.create(obj)
        const data = {
            user: { id: userIs.id }
        }
       let mailresult=''
        // const sendMail = email.sendMails(user)
        emailService.sendMails(obj, (emailResult) => {
            if (emailResult.status === 400) {
                mailresult = 'Error in sending mail'
            }
            else if(emailResult.status === 200){
                mailresult = 'Mail sent successfully'

            }
        });
        // const authtoken = jwt.sign(data, JWT_SECRET);
        return res.json({ success: true,message:"Successfully Register",mailresult })

    } catch (error) {
        console.log(error,'============errrr')
        res.status(500).send("Internal Server Error")
    }

})



router.post("/login", 

     async (req, res) => {
        try {
             
            let success = false
            const { username, password } = req.body
            console.log('------------',username,"-----",password)
            if(username =='' ){
                return res.status(400).json({ success: false, message: "Please Enter Username" });
            }
            let user = await User.findOne({ where: { username: username } })
            if(!user){
                return res.status(400).json({ success: false, message: "UserName Not Exist" });

            }
            if(user.status==='InActive'||user.status===''){
             return res.status(400).json({ success: false, message: "You'r InActive please contact Admin" });
            }
            const bytes = CryptoJS.AES.decrypt(req.body.password, process.env.secretKey);
           const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
            const comparePassword = await bcrypt.compareSync(decryptedPassword, user.password)
            // console.log(user)
            if (!comparePassword) {
                success = false
                return res.status(400).json({ success, message: "Invalid Credentials" })
            }
            const data = {
                user: { username: username, password: password }
            }
            // console.log("Your data is ", data.user)
            const authtoken = jwt.sign(data, JWT_SECRET)
            await User.update({
                authToken:authtoken,
        
            }, {
                where: {
                  username:user.username  
                }
            });  
            success = true
        const sanitizedUser = { ...user.dataValues };
        delete sanitizedUser.password;
        delete sanitizedUser.passW;
        delete sanitizedUser.createdAt;
        delete sanitizedUser.contactNo;
        delete sanitizedUser.updatedAt;
        delete sanitizedUser.email;
        delete sanitizedUser.authToken;
     res.send({ success, authtoken, id: data.user.id, user:sanitizedUser})

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message })
        }

    })
    router.get('/getUserData', fetchuser, async (req, res) => {
        try {
            const userData = await User.findAll();
            if (userData) {
                userData.forEach(user => {
                    delete user.dataValues.password;
                    delete user.dataValues.passW;
                    delete user.dataValues.authToken;
                    delete user.dataValues.roleId;
                    delete user.dataValues.createdAt;
                    delete user.dataValues.updatedAt;
                });
                return res.status(200).json({ message: "User Data retrieved successfully", userData });
            } else {
                return res.status(200).json({ message: "User Data is empty", userData });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    });
    

    router.post('/access', fetchuser,async (req, res) => {
        // const { username } = req.params;
        const { status,username } = req.body;
    
        try {
            // Find the user by username
            const user = await User.findOne({ where: { username } });
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Update the user's status, roleName, and roleId
            user.status = status;
            // user.roleName = roleName;
            // user.roleId = roleId;
    
            // Save the updated user to the database
            await user.save();
    
            return res.status(200).json({ message: "User access updated successfully" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.post('/updateUser', fetchuser,async (req, res) => {
        
        const { username,email,tokenId,contactNo, roleName} = req.body;
        try {
            // Find the user by username
            const user = await User.findOne({ where: { username } });
             let roleId ;
             if (roleName == 'Admin'){
               roleId = '1'
             }else{
               roleId='2'
             }
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }else{
                 
                const up= await User.update({
                    email:email,
                    tokenId:tokenId,
                    contactNo:contactNo,
                    roleName:roleName,
                    roleId:roleId

                }, {
                    where: {
                        username:username 
                    }
                }); 
            
            return res.status(200).json({ message: "User updated successfully" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });
    router.get('/getOne/:username',fetchuser, async (req, res) => {
        const { username } = req.params;
    
        try {
            // Find the user by username
            const user = await User.findOne({ where: { username } });
    
            if (!user) {
                return res.status(404).json({ message: "User not found",user });
            }
            user.password = undefined
            return res.status(200).json({ message: "User Data Get successfully",user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.post('/logout', async (req, res) => {
        const { username } = req.body;
    
        try {
            // Find the user by username
            const up= await User.update({
                authToken:null,
        
            }, {
                where: {
                  username:username 
                }
            });  
    
     return res.status(200).json({ message: "logout", });
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.post('/forgotPass', async (req, res) => {
        try{
            const userObj = {
                email: req.body.email,
            }
    
            const isEmailExist = await User.findOne({
                where: {email: userObj.email}
            });
    
            if(isEmailExist){
    
                const message = "Hello " + isEmailExist.username + ", please enter OTP to verify your account to proceed";
                const otp= await forgotPasswordemailOTPGenerate(isEmailExist, next);
                res.status(200).json({status:200, message});
    
            }
            else{
    
                res.status(400).json({status: 400, message: 'emailId not exist'});
    
            }
        }
        catch (err) {
            console.log(err)
            return next({status: 500, message: err});
        }
    });
    

router.post('/forgotOtpVerify',async(req,res)=>{
    try {
        const id = req.body.id
        const otp = req.body.otp
        const userAuthDetails = await userAuth.findOne({where: {UserId: email}});
        if(userAuthDetails.emailOtp==otp){
              if(userAuthDetails.status == 'active'){
                const up= await userAuth.update({
                    status:"expired",
            
                }, {
                    where: {
                      userId:id 
                    }
                }); 
                return res.status(200).json({ message: "OTP Verified" });
 
              }
              else{
                return res.status(400).json({ message: "OTP expired" });

              }
        } else{
            return res.status(400).json({ message: "InValid OTP" });
        }

    } catch (error) {
        console.log("_____error",error)
        return res.status(500).json({error})
    }
})

// router.post("/forgotPassword",async(req,res)=>{
//     try {
//         const email = req.body.email
//         const bytes = CryptoJS.AES.decrypt(req.body.password, process.env.secretKey);
//         const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
//         const salt = await bcrypt.genSalt(10)
//         var secPass = await bcrypt.hash(decryptedPassword, salt)
//         const user = await user.findOne({where: {email: email}});
//         if(user){
//         const up= await user.update({
//             password:secPass,
//             passW:decryptedPassword
    
//         }, {
//             where: {
//               email:email 
//             }
//         }); 
//     }
//     } catch (error) {
//         console.log("_____error",error)
//         return res.status(500).json({error})
//     }
// })

router.post("/forgotPassword",async(req,res)=>{
    try {
        const randomPassword = generateRandomPassword(8);
        const email = req.body.email
        const salt = await bcrypt.genSalt(10)
        var secPass = await bcrypt.hash(randomPassword, salt)
        const user = await User.findOne({where: {email: email}});
        if (!email){
            return res.status(400).json({error:"Please enter email" })
        }
        if(!user){
       
        return res.status(400).json({error:"user not found" })


    }else{
        const up= await User.update({
            password:secPass,
            passW:randomPassword
    
        }, {
            where: {
              email:email 
            }
        }); 
        const userData = await User.findOne({where: {email: email}});
        emailService.sendEmailPassword(userData,randomPassword)
        return res.status(200).json({message:"Password sent email" })

    }

    } catch (error) {
        console.log("_____error",error)
        return res.status(500).json({error})
    }
})



module.exports = router
