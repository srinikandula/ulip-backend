const express = require("express")
const router = express.Router()
const { ApiKeys } = require("../Models")
const { ApiLogs } = require("../Models")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const JWT_SECRET = 'saltcode';
var fetchuser = require("../middleware/fetchuser")
var fetchapi = require("../middleware/fetchapi")
var convert = require('xml-js');
var crypto = require('crypto');
require('dotenv').config()


router.post("/createKey", fetchuser, async (req, res) => {
    try {

        let secKey = crypto.randomUUID()

        const newKey = crypto.createCipher('aes-128-cbc', "secKey");
        var mystr = newKey.update(secKey, 'utf8', 'hex')
        mystr += newKey.final('hex');

        const dateTime = new Date()
        dateTime.setDate(dateTime.getDate() + 15)


        let key = req.body
        key.username = req.usn
        key.secKey = mystr
        key.secValidity = dateTime
        // let keyVal = key.key
        // keyVal = CrockfordBase32.encode(keyVal)
        const keyIs = await ApiKeys.create(key)
        res.json({ success: true, keyIs })
        // res.json({success:true,key, keyVal})

    } catch (error) {
        res.status(500).send("Internal Server Error")
        console.log(error.message)
    }

})

router.put("/changeip", fetchuser, async (req, res) => {
    try {
        const { myIp, passKey } = req.body
        const apiKeyIs = await ApiKeys.update({
            ip: myIp
        }, { returning: true, where: { key: passKey } })
        res.send({ success: true, apiKeyIs })

    } catch (error) {
        res.status(500).send("Internal Server Error")
        console.log(error.message)
    }

})

router.put("/generateseckey", fetchuser, async (req, res) => {
    const { passKey } = req.body

    let secKey = crypto.randomUUID()

    const newKey = crypto.createCipher('aes-128-cbc', "secKey");
    var mystr = newKey.update(secKey, 'utf8', 'hex')
    mystr += newKey.final('hex');

    const dateTime = new Date()
    dateTime.setDate(dateTime.getDate() + 15)

    console.log(dateTime)
    const apiKeyIs = await ApiKeys.update(
        {
            secKey: mystr,
            secValidity: dateTime
        },
        { returning: true, where: { key: passKey } }
    )
    res.send({ success: true, secKeyIs: mystr })


})

router.post("/createLog", async (req, res) => {
    try {

        const keyLog = req.body
        const keyLogIs = await ApiLogs.create(keyLog)
        res.json({ success: true, keyLogIs })

    } catch (error) {
        res.status(500).send("Internal Server Error")
    }

})


router.post("/fetchKeys", fetchuser, async (req, res) => {
    try {

        // const {username} = req.body
        let allKey = await ApiKeys.findAll({ where: { username: req.usn } })
        res.send({ success: true, allKey })

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }

})

router.put("/toggle-api-key", fetchuser, async (req, res) => {
    try {
        const { passKey, isEnable } = req.body
        const apiKeyIs = await ApiKeys.update({
            active: !isEnable
        }, { returning: true, where: { key: passKey } })
        res.send({ success: true, apiKeyIs })

    } catch (error) {
        res.status(500).send("Internal Server Error")
        console.log(error.message)
    }

})

router.put("/updatekey", fetchuser, async (req, res) => {
    try {
        const { passKey, applicationName, ownerName, apiKey, contactNo } = req.body
        const apiKeyIs = await ApiKeys.update({
            applicationName:applicationName,
            ownerName:ownerName,
            contactNo:contactNo,
            apiKey:apiKey
        }, { returning: true, where: { key: passKey } })
        res.send({ success: true, apiKeyIs })

    } catch (error) {
        res.status(500).send("Internal Server Error")
        console.log(error.message)
    }

})

router.post("/fetchmykey", fetchuser, async (req, res) => {
    try {
        const { passKey } = req.body
        let mykey = await ApiKeys.findOne({ where: { key: passKey } })
        res.send({ success: true, mykey })
    } catch (error) {

        console.log(error.message)
        res.status(500).send("Internal Server Error")

    }
})

router.post("/fetchLogs", fetchuser, async (req, res) => {
    try {

        const { username } = await req.usn
        console.log(username)
        let allLogs = await ApiLogs.findAll({ where: { username: req.usn } })
        res.send({ success: true, allLogs })

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }

})


const correctVahan = (jsval) => {
    console.log("insdie the correct vahan", jsval)
    // jsval = jsval.json
    let tempJs = {}
    let jsKey = Object.keys(jsval)
    let jsValAll = Object.values(jsval)
    for (let i = 0; i < jsValAll.length; i++) {
        if (jsValAll[i]._text) {
            tempJs[jsKey[i]] = jsValAll[i]._text

        }
        else {
            tempJs[jsKey[i]] = jsValAll[i]
        }

    }
    return tempJs

}


router.post("/ulip/v1.0.0/:ulipIs/:reqIs", fetchapi, async (req, res) => {

    try {
        // console.log("all next completed")
        // console.log("the requested mware ", req.usn)
        // const reqAuthKey = req.header
        // console.log(JSON.stringify(req.body), req.header('Authorization'))
        const url = `${process.env.ulip_url}/${req.params.ulipIs}/${req.params.reqIs}`
        // const url = "http://localhost:3002/api/vahaan/ulip/v1.0.0/VAHAN/01"
        console.log("Url is ", url)

        // 

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': "application/json",
                'Authorization': `Bearer ${req.authorization}`,
                // 'Authorization': req.header('Authorization'),

            },
            body: JSON.stringify(req.body)
        })

        // 

        // console.log("all done", req.authorization)
        let json = await response.json()



        // console.log(json, "is the response")


        let respBody = {
            error: json.error,
            code: json.code,
            message: json.message
        }

        if (req.params.ulipIs === "VAHAN") {

            const xmlString = json.response[0].response
            var result1 = convert.xml2js(xmlString, { compact: true, spaces: 4 });
            const vhdet = result1["VehicleDetails"]

            // res.send({ success: true, vhdet })
            json = await correctVahan(vhdet)
            console.log(json)

        }


        // if(req.params.ulipIs === "FASTAG"){
        //     respBody = json.json.response[0].response
        // }
        // else if(req.params.ulipIs === "FOIS"){
        //     respBody = json.json.response[0].response[0]
        //     console.log("reached here", respBody)
        // }
        // else if(req.params.ulipIs === "VAHAN"){
        //     console.log("reacehd hewrer")
        //     respBody = await correctVahan(json)
        // }

        const urlArray = req.url.split("/")
        const dt = new Date()
        // console.log(JSON.stringify(respBody).length)
        const newApiLog = {
            key: req.header("api-key"),
            ulip: urlArray[3],
            reqDataCode: urlArray[4],
            resData: JSON.stringify(respBody),
            time: dt.getTime(),
            applicationName: req.applicationName,
            username: req.usn,
            reqData: JSON.stringify(req.body)

        }
        console.log("logs sent")
        const apiLogIs = await ApiLogs.create(newApiLog)

        res.send({ success: true, json })


    } catch (error) {

    }

})


// router.post("/ulip/v1.0.0/VAHAN/02",fetchuser, fetchapi, async(req,res)=>{

//     try {

//         const response = await fetch(`http://localhost:3002/api/vahaan/ulip/v1.0.0/VAHAN/02`, {
//             method: 'POST'
//         })
//           const json = await response.json()
//         res.send({success:"API key fetch successfully", json})

//     } catch (error) {

//     }

// })


// router.post("/ulip/v1.0.0/VAHAN/03",fetchuser, fetchapi, async(req,res)=>{

//     try {

//         const response = await fetch(`http://localhost:3002/api/vahaan/ulip/v1.0.0/VAHAN/02`, {
//             method: 'POST'
//         })
//           const json = await response.json()
//         res.send({success:"API key fetch successfully", json})

//     } catch (error) {

//     }

// })


module.exports = router