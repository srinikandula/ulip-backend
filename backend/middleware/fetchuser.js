var jwt = require("jsonwebtoken")
const JWT_SECRET = "saltcode"
const {User}  = require("../Models")
const bcrypt = require("bcryptjs")
const fetchuser =async(req,res,next)=>{
     
    //get the user from the jwt token and add id to req object
    const token = req.header("auth-token")
    if(!token){
        
        res.status(401).send({error: "Please authenticate using a valid token"})   //status 401 stands for access denied
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        let userPerson = await User.findOne({ where: { username: data.user.username } })
        const comparePassword = await bcrypt.compare(data.user.password, userPerson.password)
        req.usn = data.user.username
        // console.log("Compare password ",comparePassword)
        if (!comparePassword) {
            
            return res.status(400).json({ success:false, error: "Please authenticate using a valid token" })
        }
        next()
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    
}

module.exports = fetchuser