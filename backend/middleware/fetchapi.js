const { ApiKeys } = require("../Models")
const {ApiLogs} = require("../Models")

// const router = express.Router()


const ulipUiError = async (urlArray, mybody, respBody, appliName, myKey, req) => {

    const dt = new Date()
    const newApiLog = {
        key: myKey,
        ulip: urlArray[3],
        reqDataCode: urlArray[4],
        resData: JSON.stringify(respBody),
        time: dt.getTime(),
        applicationName: appliName,
        username: req.usn,
        reqData: JSON.stringify(mybody)

    }
    console.log("logs sent")
    const apiLogIs = await ApiLogs.create(newApiLog)
}

const fetchapi = async (req, res, next) => {
    const apiKey = req.header("api-key")
    const secKeyH = req.header("seckey")

    try {
        let myKey = await ApiKeys.findOne({ where: { key: apiKey } })
        const responseIp = await fetch(process.env.ip_fetch_rul, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': "application/json",

            },
        })

        const jsonIp = await responseIp.json()

        if (jsonIp.ip != myKey.ip && myKey.ip != "0.0.0.0") {
            const urlArray = req.url.split("/")
            const mybody = req.body
            const appliName = myKey.applicationName
            const myKey = myKey.key
            const json = {
                error: "true",
                message: "Access Denied"
            }
            ulipUiError(urlArray, mybody, json, appliName, myKey, req)
            return res.status(403).send({ success: false, message: "Access Denied!" })
        }
        req.usn = myKey.username
        const user = myKey.username
        req.applicationName = myKey.applicationName
        let mySecKey = myKey.secKey
        if (mySecKey != secKeyH) {
            const urlArray = req.url.split("/")
            const mybody = req.body
            const appliName = myKey.applicationName
            const myKey = myKey.key
            const json = {
                error: "true",
                message: "Access Denied"
            }
            ulipUiError(urlArray, mybody, json, appliName, myKey, req)
            return res.status(403).send({ success: false, message: "Access Denied!" })
        }
        else if (myKey.username === user) {

            const login_body = {
                username: process.env.ulip_username,
                password: process.env.ulip_password
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

            if (resp_login.error === 'false') {
                req.authorization = await resp_login.response.id
                // next()
            }
            else {
                const urlArray = req.url.split("/")
                const mybody = req.body
                const appliName = myKey.applicationName
                const myKey = myKey.key
                ulipUiError(urlArray, mybody, resp_login, appliName, myKey, req)
                return res.status(401).send({ success: false, message: "Access Denied!" })
            }

            next()
        }
        else {
            return res.status(401).send({ error: "Wrong Api key entered" })
        }

    } catch (error) {
        res.status(501).send({ error: error.message })
    }

}

module.exports = fetchapi