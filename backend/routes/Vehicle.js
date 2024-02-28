const express= require("express")
const router= express.Router()
const {Vehicle} = require("../Models")
var jwt = require('jsonwebtoken'); 
var bcrypt = require('bcryptjs');
const JWT_SECRET = 'saltcode';

router.post("/add", async(req, res)=>{

    try {

        const vehicle = req.body
        const vehicleIs = await Vehicle.create(vehicle)
        res.json({vehicleIs})
        
    } catch (error) {
        
        console.log(error.message)
        res.status(500).send("Internal Server Error")

    }


})

router.get("/fetchvehicle", async(req, res)=>{

    try {

        const {vehicleNo, rc_chasi_no, rc_eng_no} = req.body
    if(vehicleNo){
        let vehicleDet = await Vehicle.findOne({where:{vehicleNo}})
        if(vehicleDet){
            return res.json({success:true, vehicleDet})

        }
        else{
            return res.status(404).send({success:false})
        }
    }
    if(rc_chasi_no){
        let vehicleDet = await Vehicle.findOne({where:{rc_chasi_no}})
        if(vehicleDet){
            return res.json({success:true, vehicleDet})

        }
        else{
            return res.status(404).send({success:false})
        }
    }
    if(rc_eng_no){
        let vehicleDet = await Vehicle.findOne({where:{rc_eng_no}})
        if(vehicleDet){
            return res.json({success:true, vehicleDet})

        }
        else{
            return res.status(404).send({success:false})
        }
    }
    return res.status(401).send({success:false})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }

    

})

module.exports = router