const express = require("express")
const router = express.Router()
const { ApiKeys } = require("../Models")
const { ApiLogs } = require("../Models")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const JWT_SECRET = 'saltcode';
var fetchuser = require("../middleware/fetchuser")
var fetchapi = require("../middleware/fetchapi")

router.post("/ulip/v1.0.0/SARATHI/01",fetchuser, fetchapi, async(req,res)=>{

    try {
        
        const response = await fetch(`http://localhost:3002/api/vahaan/ulip/v1.0.0/VAHAN/02`, {
            method: 'POST'
        })
          const json = await response.json()
        res.send({success:"API key fetch successfully", json})
        
    } catch (error) {
        
    }

})



module.exports = router