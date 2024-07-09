var jwt = require("jsonwebtoken")
const JWT_SECRET = "saltcode"
const {User}  = require("../Models")
const bcrypt = require("bcryptjs")
const CryptoJS = require("crypto-js");

const fetchuser =async(req,res,next)=>{
     
    //get the user from the jwt token and add id to req object
    const token = req.header("auth-token")
    console.log(token,"0--------------token")
    if(!token || token==null){
        
        res.status(401).send({error: "Please pass authToken"})   //status 401 stands for access denied
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        let userPerson = await User.findOne({ where: { username: data.user.username } })
        // const bytes = CryptoJS.AES.decrypt(data.user.password, process.env.secretKey);
        // const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        // const comparePassword = await bcrypt.compare(decryptedPassword, userPerson.password)
         req.usn = data.user.username
        //  console.log("Compare password ",comparePassword)
        if (userPerson.authToken != token) {
            return res.status(401).json({ success:false, error: "Invalid authToken" })
        }
        next()
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    
}

module.exports = fetchuser