const bcrypt = require("bcrypt");
const db = require('../config/dbConn');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const validator = require('validator');
const Sequelize = require('sequelize');
const CryptoJS = require("crypto-js");
const passport = require("passport");
const MailerService = require("../services/mailer.service");


async function emailOTPGenerate(userObj, done) {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        if (OTP) {
            const now = new Date();
            const expirationTime = new Date(now.getTime() + 3 * 60000);
            const data = {
                userId: userObj.id,
                emailOtp: OTP,
                expiresIn: expirationTime,
                status: 'active',
            };

            const userAuthDetails = await db.userAuthModel.findOne({where: {userId: userObj.id}});
            if (userAuthDetails) {
                let result = await db.userAuthModel.update({
                    emailOtp: OTP,
                    expiresIn: expirationTime,
                    status: 'active',
                }, {where: {userId: userObj.id}});
                if (result) {
                    await MailerService.otpGenerationForTwoWay(userObj, OTP, done);
                } else {
                    return done(null, false);
                }
            } else {
                let result = await db.userAuthModel.create(data);
                if (result) {
                    await MailerService.otpGenerationForTwoWay(userObj, OTP, done);
                } else {
                    return done(null, false);
                }
            }
        }
    } catch (e) {
        console.log(e)
        done({
            status: 400,
            message: e,
        });
    }
}


exports.login = async (req, next) => {
    try {
        let user = await db.userModel.findOne({where: {email: req.body.email}});
        if (!user) {
            next({
                status: 400,
                message: 'EMAIL_NOT_FOUND',
            });
        } else {
            if (user.status === "Active") {
                try {
                    const bytes = CryptoJS.AES.decrypt(req.body.password, config.secretKey);
                    const decryptedPassword = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                    // console.log(decryptedPassword, config.secretKey)
                    if (bcrypt.compareSync(decryptedPassword, user.password)) {
                        const message = "Hello " + user.fullName + ", please enter OTP to verify your account to proceed";
                        await emailOTPGenerate(user, next);
                        next({status: 200, message});
                    } else {
                        next({status: 400, message: 'INVALID_CREDENTIALS'});
                    }
                } catch (e) {
                    return next({status: 500, message: e});
                }
            } else {
                next({
                    status: 400,
                    message: 'NOT_ACTIVATED',
                });
            }
        }
    } catch (e) {
        console.log(e)
        return next({status: 500, message: e});
    }
}

exports.saveUser = async (req, next) => {
    try {
        if (!(req.body.fullName && /^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(req.body.fullName))) {
            return next({status: 500, message: 'INVALID_NAME'});
        } else if (!validator.isEmail(req.body.email)) {
            return next({status: 500, message: 'INVALID_EMAIL'});
        } else if (!(req.body.mobileNumber && /^\d{10}$/.test(req.body.mobileNumber))) {
            return next({status: 500, message: 'INVALID_MOBILE'});
        }
            // else if (!req.body.customerCode) {
            //     return next({status: 500, message: 'INVALID_CUSTOMER'});
        // }
        else if (!req.body.description) {
            return next({status: 500, message: 'INVALID_DESCRIPTION'});
        }

        const userObj = {
            email: req.body.email,
            fullName: req.body.fullName,
            // customerCode: req.body.customerCode,
            description: req.body.description,
            // accessRequest: req.body.accessRequest,
            mobileNumber: req.body.mobileNumber,
            status: "Pending",
        }

        // const salt = await bcrypt.genSaltSync(10);
        // userObj.password = await bcrypt.hashSync(userObj.password, salt);
        const isEmailExist = await db.userModel.findOne({
            where: {email: userObj.email}
        });
        const isMobileExists = await db.userModel.findOne({
            where: {mobileNumber: userObj.mobileNumber}
        });
        if (isEmailExist) {
            return next({status: 400, message: 'EMAIL_EXISTS'});
        } else if (isMobileExists) {
            return next({status: 400, message: 'MOBILE_EXISTS'});
        } else {
            const user = await db.userModel.create(userObj);
            delete user.password;
            req.user = user;
            next({status: 200, result: user, message: 'SAVED_SUCCESSFULLY'});
        }
    } catch (err) {
        return next({status: 500, message: err});
    }
}


exports.getCustomerCodes = async (req, next) => {
    try {
        const customerData = await db.customersModel.findAll();
        return next({status: 200, result: customerData, message: 'FETCHED_SUCCESSFULLY'});
    } catch (e) {
        return next({status: 500, message: e});
    }
}

exports.getAllLocations = async (req, next) => {
    try {
        const locationsData = await db.locationModel.findAll({});
        return next({status: 200, result: locationsData, message: 'FETCHED_SUCCESSFULLY'});
    } catch (e) {
        return next({status: 500, message: e});
    }
}

exports.resendOtp = async (req, next) => {
    try {
        let user = await db.userModel.findOne({where: {email: req.body.email}});
        // if (user.otpCount < 3) {
            await emailOTPGenerate(user, next);
            // await db.userModel.update({otpCount: user.otpCount + 1}, {where: {email: req.body.email}});
            next({status: 200, message: 'OTP sent successfully..!'});
        // } else {
        //     return next({status: 400, message: 'MAX_OTP_COUNT_REACHED'})
        // }
    } catch (e) {
        console.log(e);
        return next({status: 500, message: e})
    }
}

exports.validateEmail = async (emailId, next) => {
    try{
        let user = await db.userModel.findOne({where: {email: emailId}});
        if (user) {
            next({status: 200, message: 'EMAIL_AVAILABLE'});
        }else{
            next({status: 400, message: 'EMAIL_NOT_FOUND'});
        }

    }catch (e) {
        console.log(e);
        return next({status: 500, message: e})
    }
}
