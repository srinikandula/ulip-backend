const { ApiKeys } = require("../Models")
const { ApiLogs } = require("../Models")

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


function getPublicIPAddress(req, callback) {
    const options = {
        hostname: 'api.ipify.org',
        port: 80,
        path: '/',
        method: 'GET'
    };

    const request = http.request(options, (response) => {
        let data = '';

        // A chunk of data has been received.
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        response.on('end', () => {
            callback(null, data);
        });
    });

    request.on('error', (error) => {
        callback(error, null);
    });

    request.end();
}

const fetchapi = async (req, res, next) => {
    const apiKey = req.header("api-key")
    const secKeyH = req.header("seckey")


    try {
        

        const requesterIP2 = await req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        var myKey = await ApiKeys.findOne({ where: { key: apiKey } })
        if (myKey === null) {
            return res.status(401).send({ success: false, message: "Invalid API key entered" })
        }
        
        const jsonIp = requesterIP2

        if (jsonIp.ip != myKey.ip && myKey.ip != "0.0.0.0") {

            const urlArray = req.url.split("/")
            const mybody = req.body
            const appliName = myKey.applicationName
            const mkey = myKey.key
            const json = {
                code: 403,
                message: "Forbidden"
            }
            ulipUiError(urlArray, mybody, json, appliName, mkey, req)
            return res.status(403).send({ success: false, message: "Access Denied!" })
        }
        console.log("a2")
        req.usn = await myKey.username
        const user = await myKey.username
        req.applicationName = await myKey.applicationName
        let mySecKey = await myKey.secKey
        console.log("a3")
        if (mySecKey != secKeyH) {

            const urlArray = req.url.split("/")
            const mybody = req.body
            const appliName = myKey.applicationName
            const mkey = myKey.key
            const json = {
                code: 401,
                message: "Access Denied"
            }
            ulipUiError(urlArray, mybody, json, appliName, mkey, req)
            console.log("a4")

            return res.status(401).send({ success: false, message: "Access Denied!" })
        }
        else if (myKey.username === user) {
            console.log("a5")

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
            console.log("a6")

            if (resp_login.code === "200") {
                req.authorization = await resp_login.response.id
                // next()
                console.log("a7")
            }
            else {
                console.log("a8")
                const urlArray = await req.url.split("/")
                const mybody = await req.body
                const appliName = req.applicationName
                const mkey = req.header("api-key")
                // await delete resp_login.error
                ulipUiError(urlArray, mybody, resp_login, appliName, mkey, req)
                return res.status(401).send(resp_login)
            }

            next()
        }
        else {
            return res.status(401).send({ error: "Wrong Api key entered" })
        }

    } catch (error) {
        // const urlArray = req.url.split("/")
        // const mybody = req.body
        // const appliName = req.applicationName
        // const mkey = req.header("api-key")
        // const myjson = { code:501, success: false, message: error.message }
        // ulipUiError(urlArray, mybody, myjson, appliName, mkey, req)
        res.status(501).send(myjson)
    }

}

module.exports = fetchapi