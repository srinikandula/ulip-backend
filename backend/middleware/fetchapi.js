const {ApiKeys} = require("../Models")

// const router = express.Router()

const fetchapi = async(req, res, next)=>{
    const apiKey = req.header("api-key")
    const secKeyH= req.header("seckey")
    // const user = req.usn

    try {
        let myKey = await ApiKeys.findOne({ where: { key:apiKey } })
        const responseIp = await fetch(process.env.ip_fetch_rul, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': "application/json",
                
            },
        })
        console.log("here", process.env.ip_fetch_rul)
        const jsonIp = await responseIp.json()
        console.log("My received ip is ", responseIp)
        if(jsonIp.ip != myKey.ip && myKey.ip != "0.0.0.0"){
            console.log("Ip problem")
            return res.status(403).send({success:false, message:"Access Denied!"})   
        }
        req.usn = myKey.username
        const user = myKey.username
        req.applicationName = myKey.applicationName
        let mySecKey = myKey.secKey
        if(mySecKey != secKeyH){
            // console.log("sec key api ", mySecKey === secKeyH, dt.getDate()>myKey.secValidity.getDate(), dt.getDate(), "  ", myKey.secValidity.getDate())
            return res.send("Wrong API key entered")
        }
        else if(myKey.username === user){
            
            const login_body = {
                username:process.env.ulip_username,
                password:process.env.ulip_password
            }
            console.log("login body is ", login_body)
            const response = await fetch(process.env.ulip_login_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': "application/json",
                },
                body: JSON.stringify(login_body)
            })
            const resp_login = await response.json()
            console.log("response login recieved ", resp_login)
            if(resp_login.error === 'false'){
                console.log("inside correct authentication")
                req.authorization = await resp_login.response.id
                next()
            }
            else{
                return res.status(401).send({success:false, message:"Access Denied!"})
            }
            
            next()
        }
        else{
            return res.status(401).send({ error: "Wrong Api key entered"})
        }

    } catch (error) {
        res.status(501).send({error:error.message})
    }
    
}

module.exports = fetchapi