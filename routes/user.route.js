const express = require('express');
const passport = require('passport');

// Controllers
const UserController = require('../controllers/user.controller');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

// User Logout
router.get('/logout', (req,res)=>{
    UserController.logout(req, result => {
        res.status(result.status).json(result);
    });
});

// Email OTP Verification API Route
router.post('/verifyEmailOTP', checkValidations,  passport.authenticate('local', {session: false}),(req,res)=>{
    UserController.verifyEmailOTP(req, result => {
        res.status(result.status).json(result);
    });
});

function checkValidations(req, res, next) {
    const emailOtp = req.body.emailOtp;
    if (!emailOtp) {
        return next({status: 500, message: 'OTP_MANDATORY'});
    } else if (emailOtp.length !== 6) {
        return next({status: 500, message: 'OTP_SHOULD_6_DIGITS'});
    }
    next();
}
router.post('/me', passport.authenticate('jwt', {session: true}), (req, res) => {
    UserController.verifyEmailOTP(req, result => {
        res.status(result.status).json(result);
    })
});

// Resend OTP to Email
router.post('/resendOtp', (req, res) => {
    AuthController.resendOtp(req, result => {
        res.status(result.status).json(result);
    })
});

// Verifying Token
router.use(passport.authenticate('jwt', { session: false }));

router.post('/getAllUsers', (req, res) => {
    UserController.getAllUsers(req.params.status, req, result => {
        res.status(result.status).json(result);
    });
});

// Get All Users By Status
router.post('/getAllUsersByStatus/:status', (req, res) => {
    UserController.getAllUsersByStatus(req.params.status, req, result => {
        res.status(result.status).json(result);
    });
});

//Activating User
router.post('/approveUser/:userId', (req, res) => {
    UserController.approveUser(req.params.userId, req.body, result => {
        res.status(result.status).json(result);
    });
});

//Rejecting User
router.get('/rejectUser/:userId', (req, res) => {
    UserController.rejectUser(req.params.userId, result => {
        res.status(result.status).json(result);
    });
});

//updatePassword
router.put('/update/:userId', (req,res)=>{
    UserController.updatePassword(req.params.userId, req.body, result => {
        res.status(result.status).json(result);
    });

});

// Update User Details
router.put('/updateUser/:userId', (req,res)=>{
    UserController.updateUser(req.params.userId, req.body, result => {
        res.status(result.status).json(result);
    });

});

module.exports = router;
