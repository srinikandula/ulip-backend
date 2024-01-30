const express = require('express');
const passport = require('passport');

// Controllers
const AuthController = require('../controllers/auth.controller');
const validator = require("validator");

const router = express.Router();

// User Register Route
router.post('/saveUser', (req, res) => {
    AuthController.saveUser(req, result => {
        res.status(result.status).json(result);
    });
});

// Login API
router.post('/login', checkValidations, (req, res) => {
    AuthController.login(req, result => {
        res.status(result.status).json(result);
    })
});

function checkValidations(req, res, next) {
    const userObj = req.body;
    if (!userObj.email && !userObj.password) {
        return res.status(400).json({message: 'Please enter a Email and Password'});
    }else if (!validator.isEmail(userObj.email)) {
        return res.status(400).json({ message: 'INVALID_EMAIL'});
    }else if (!userObj.password) {
        return res.status(400).json({message: 'INVALID_PASSWORD'});
    }
  next();
}

router.get('/getCustomerCodes', (req, res) => {
    AuthController.getCustomerCodes(req, result => {
        res.status(result.status).json(result);
    })
});

router.get('/validateEmail/:emailId', (req, res) => {
    AuthController.validateEmail(req.params.emailId, result => {
        res.status(result.status).json(result);
    })
});

router.get('/getAllLocations', (req, res) => {
    AuthController.getAllLocations(req, result => {
        res.status(result.status).json(result);
    })
});

module.exports = router;

