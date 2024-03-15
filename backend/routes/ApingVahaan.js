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
var nodemailer = require("nodemailer");
const fs = require("fs")
const { body, validationResult } = require('express-validator');

router.post("/sendmailcreatekey", [
    body("email", "Must be a email").isEmail(),
    body("applicationName", "Application Name must have some value").isLength({ min: 1 }),
    body("ownerName", "Owner Name must have some value").isLength({ min: 1 }),
    body("apiKey", "Empty API key passed").isLength({ min: 1 }),

],
    fetchuser, async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            const htmlTemplate = fs.readFileSync('Html/index.html', 'utf8');

            // Replace placeholders with provided parameters
            const renderedHtmlContent = htmlTemplate.replace('{apiKey}', req.body.apiKey)
                .replace('{applicationName}', req.body.applicationName)
                .replace('{ownerName}', req.body.ownerName);


            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "service.ulipmll@gmail.com",
                    pass: "fpxa maku oavr owcv"
                }
            })
            var mailOptions = {
                from: "service.ulipmll@gmail.com",
                to: req.body.email,
                subject: "Testing mail",
                html: renderedHtmlContent

            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("The error is ", error)
                    res.send("error")
                }
                else {
                    console.log("Email sent", info.response)
                    res.send({ success: true })
                }
            })

        } catch (error) {
            res.status(500).send("Internal Server Error")
        }



    })


router.post("/createKey", [
    body("email", "Must be a email").isEmail(),
    body("applicationName", "Application Name must have some value").isLength({ min: 1 }),
    body("ownerName", "Owner Name must have some value").isLength({ min: 1 }),
    body("ip", "Should be a valid IP address").isLength({ min: 4 }),
    body("key", "Empty API key passed").isLength({ min: 1 }),
    body("contactNo", "Contact Number should be greater than 8 characters").isLength({ min: 8 }),

], fetchuser, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

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

router.delete("/deletemykey", [
    body("apiKey", "Empty API key passed").isLength({ min: 1 }),

], fetchuser, async (req, res) => {
    try {
        const { apiKey } = req.body
        await ApiKeys.destroy({
            where: {
                key: apiKey
            },
        });
        res.send({success:true, msg:"Key deleted successfully"})
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

router.put("/generateseckey", [
    body("passKey", "Key should have value").isLength({ min: 1 })
],
    fetchuser, async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
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

        } catch (error) {
            res.status(500).send("Internal Server Error")
        }


    })

router.post("/createLog", [
    body("key", "Invalid API key").isLength({ min: 1 }),
    body("ulip", "Invalid ULIP data request").isLength({ min: 1 }),
    body("applicationName", "Invalid Application Name").isLength({ min: 1 }),
    body("username", "Username must be 4 characters").isLength({ min: 4 })
],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

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

        let allKey = await ApiKeys.findAll({ where: { username: req.usn } })
        res.send({ success: true, allKey })

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }

})

router.put("/toggle-api-key", fetchuser, [
    body("passKey", "API must be valid").isLength({ min: 1 }),
    body("isEnable", "API key toggle failed").isBoolean()

],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

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

router.put("/updatekey", fetchuser, [
    body("passKey", "Empty API key passed").isLength({ min: 1 }),
    body("applicationName", "Application Name must have some value").isLength({ min: 1 }),
    body("ownerName", "Owner Name must have some value").isLength({ min: 1 }),
    body("email", "Must be a email").isEmail(),
    body("contactNo", "Contact Number should be greater than 8 characters").isLength({ min: 8 }),
]

    , async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            const { passKey, applicationName, ownerName, apiKey, contactNo } = req.body
            const apiKeyIs = await ApiKeys.update({
                applicationName: applicationName,
                ownerName: ownerName,
                contactNo: contactNo,
                apiKey: apiKey
            }, { returning: true, where: { key: passKey } })
            res.send({ success: true, apiKeyIs })

        } catch (error) {
            res.status(500).send("Internal Server Error")
            console.log(error.message)
        }

    })

router.post("/fetchmykey", fetchuser, [
    body("passKey", "Empty API key passed").isLength({ min: 1 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    try {
        const { passKey } = req.body
        let mykey = await ApiKeys.findOne({ where: { key: passKey } })
        res.send({ success: true, mykey })
    } catch (error) {

        console.log(error.message)
        res.status(500).send("Internal Server Error")

    }
})

router.post("/fetchLogs", fetchuser, [
    body("username", "Username Must be more than 4 characters").isLength({ min: 4 }),

],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

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
        const url = `${process.env.ulip_url}/${req.params.ulipIs}/${req.params.reqIs}`
        console.log("my url is ", url)

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

        let json = await response.json()
        console.log("reached at json ", json)
        if(json.error){
            return res.send(json)
        }



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
        console.log(error.message)
        res.status(500).send("Internal Server Error")
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
