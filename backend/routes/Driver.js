const express = require("express")
const router = express.Router()
const { Driver } = require("../Models")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const JWT_SECRET = 'saltcode';

router.get("/", async (req, res) => {

    try {
        const listOfDrivers = await Driver.findAll()
        res.json(listOfDrivers)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }


})

router.post("/add", async (req, res) => {
    try {

        const drv = req.body
        const salt = await bcrypt.genSalt(10)
        var secPass = await bcrypt.hash(drv.password, salt)
        drv.password = secPass
        const driverIs = await Driver.create(drv)
        const data = {
            user: { id: driverIs.id }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authtoken: authtoken, driverIs })

    } catch (error) {
        res.status(500).send("Internal Server Error")
    }

})


router.post("/login", async (req, res) => {
    try {

        let success = false
        const { username, password } = req.body
        let drUser = await Driver.findOne({ where: { username: username } })
        const comparePassword = await bcrypt.compare(password, drUser.password)
        console.log(drUser)
        if (!comparePassword) {
            success = false
            return res.status(400).json({ success, error: "Please try with correct password" })
        }
        const data = {
            user: { id: drUser.id }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.send({ success, authtoken, id: data.user.id, drUser })

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }

})


// Assigning Vehicle

router.put("/boarding", async (req, res) => {
    try {
        const { vehicleNo, DLN, productId, productQuantity, travellingFrom, travellingTo } = req.body
        let drUser = await Driver.findOne({ where: { DLN } })
        drUser = drUser.dataValues
        if (!drUser.isTravelling) {
            
            await Driver.update(
                {
                    isTravelling: true,
                    vehicleNo: vehicleNo,
                    productId: productId,
                    productQuantity: productQuantity,
                    travellingFrom: travellingFrom,
                    travellingTo: travellingTo
                },
                { returning: true, where: { DLN: DLN } }
            )

            res.send({ success: true })
        }
        else {
            res.send("Driver already onboarded")
        }



    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// On reaching end

router.put("/deboard", async(req, res)=>{
    try {

        const {DLN} = req.body
        await Driver.update({
            isTravelling: null,
            vehicleNo: null,
            productId: null,
            productQuantity: null,
            travellingFrom: null,
            travellingTo: null,
            cLocation:null,
        },
        { returning: true, where: { DLN: DLN } })
        res.send({success:true})

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }
    
})

// New location

router.put('/updatelocation', async(req, res)=>{
    try {
        
        const {cLocation, DLN} = req.body
        let drUser = await Driver.findOne({ where: { DLN } })
        drUser = drUser.dataValues
        if(drUser.isTravelling){
            await Driver.update(
                {cLocation:cLocation},
                { returning: true, where: { DLN: DLN } }
            )
            
        }
        res.send({success:true})

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }
})


module.exports = router