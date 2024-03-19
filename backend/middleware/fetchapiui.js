const { ApiKeys } = require("../Models")
const {ApiLogs} = require("../Models")


const ulipUiError = async (urlArray, mybody, respBody, appliName, myKey, req) => {

    const dt = new Date()
    const newApiLog = {
        key: myKey,
        ulip: urlArray[3],
        reqDataCode: urlArray[4],
        resData: JSON.stringify(respBody),
        time: dt.getTime(),
        applicationName: appliName,
        username: req.header("user"),
        reqData: JSON.stringify(mybody)

    }
    console.log("logs sent")
    const apiLogIs = await ApiLogs.create(newApiLog)
}

// const router = express.Router()

const fetchapiui = async(req, res, next)=>{
    try {
        console.log("insdie eh fetechers")
        const apiKey = req.header("api-key")
        const secKeyH= req.header("seckey")
        if(apiKey === "16f78afa-e306-424e-8a08-21ad21629404" && secKeyH === "f968799f2906991647c9941bbd8c97a746cd2cc320f390a310c170e0f072bc5bf71c372060e799b75a323f57d3ccdf8b"){
            
        }else{
            const urlArray = req.url.split("/")
            urlArray.splice(0,0,'')
            const mybody = req.body
            const appliName = "--"
            const myKey = "Ulip Interface Used"
            const json = {
                error: "true",
                message: "Access Denied"
            }
            ulipUiError(urlArray, mybody, json, appliName, myKey, req)
            return res.status(401).send({success:false, message:"Unauthorized"})
        }
        const userUi = req.header("user")
        req.usn = userUi
        
        const login_body = {
            username:process.env.ulip_username,
            password:process.env.ulip_password
        }
        
        const response = await fetch(process.env.ulip_login_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': "application/json",
            },
            body: JSON.stringify(login_body)
        })
        const resp_login = await response.json()
        
        if(resp_login.error === 'false'){
            req.authorization = await resp_login.response.id
        }
        else{
            const urlArray = req.url.split("/")
            urlArray.splice(0,0,'')
            console.log("my url array is ", urlArray)
            const mybody = req.body
            const appliName = "--"
            const myKey = "Ulip Interface Used"
            ulipUiError(urlArray, mybody, resp_login, appliName, myKey, req)
            return res.status(401).send({success:false, message:"Access Denied!"})
        }
        
        next()
        

    } catch (error) {
        res.status(501).send({error:error.message})
    }
    
}

module.exports = fetchapiui