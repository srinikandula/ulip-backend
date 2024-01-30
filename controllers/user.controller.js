const bcrypt = require("bcrypt");
const db = require('../config/dbConn');
const UserActiveMail = require('../services/mailer.service');
const CryptoJS = require("crypto-js");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const AuthController = require('../controllers/auth.controller');


exports.getAllUsers = async (status, req, next) => {
    try {
        const query = `select U.id,
                              U.fullName,
                              U.email,
                              U.mobileNumber,
                              U.status,
                              U.cityId,
                              L.location,
                              C.customerName,
                              U.description
                       from user U
                                left join locations L on L.location_id = U.cityId
                                left join (select distinct customerCode, customerName from customers) C
                                          on U.customerCode = C.CustomerCode`;

        const usersList = await db.sequelize.query(query, {type: db.sequelize.QueryTypes.SELECT});
        next({status: 200, result: usersList, message: 'FETCHED_SUCCESSFULLY'});
    } catch (e) {
        console.log(e);
        return next({status: 500, message: e});
    }
}

exports.getAllUsersByStatus = async (status, req, next) => {
    try {
        const users = await db.userModel.findAll({where: {status: status}, attributes: {exclude: 'password'}});
        next({status: 200, result: users, message: 'FETCHED_SUCCESSFULLY'});
    } catch (e) {
        return next({status: 500, message: e});
    }
}

exports.approveUser = async (userId, body, next) => {
    try {
        if (userId) {
            //let password = (Math.floor(10000000 + Math.random() * 90000000)).toString().replace(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8}$/,'');
            const password = Math.random().toString(36).substr(2, 5) + Math.random().toString(36).substr(2, 3).toUpperCase() + "!@#$%^&*()".charAt(Math.floor(Math.random() * 10));
            //let password = (Math.floor(100000 + Math.random() * 900000)).toString();
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const updatedUser = await db.userModel.findOne({where: {id: userId}});
            if (updatedUser.status === "Pending") {
                const user = await db.userModel.update({
                    status: 'Active',
                    password: hashedPassword,
                    cityId: body.locationId,
                    customerCode: body.customerCode
                }, {where: {id: userId}});
                await UserActiveMail.activeUserMail(updatedUser.dataValues, password, next);
                next({status: 200, result: user, message: 'UPDATED_SUCCESSFULLY'});
            } else if (updatedUser.status === "Rejected") {
                next({status: 400, message: 'CANNOT_PERFORM_ACTION'});
            } else {
                next({status: 400, message: 'ALREADY_ACTIVATED'});
            }
        }
    } catch (e) {
        return next({status: 500, message: e});
    }
}

exports.rejectUser = async (userId, next) => {
    try {
        if (userId) {
            const user = await db.userModel.update({status: 'Rejected'}, {where: {id: userId}});
            next({status: 200, result: user, message: 'REJECTED_SUCCESSFULLY'});
        }
    } catch (e) {
        return next({status: 500, message: e});
    }
}

//Update password
exports.updatePassword = async (userId, body, next) => {
    try {
        if (userId) {
            const password = body.password;
            const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,13}$/;
            const bytes = CryptoJS.AES.decrypt(password, config.secretKey);
            const decryptedPassword = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            if (!decryptedPassword) {
                next({status: 400, message: 'PASSWORD_MANDATORY'});
            } else if (!(regexPattern.test(decryptedPassword))) {
                next({status: 400, message: 'INVALID_PASSWORD'});
            } else {
                const user = await db.userModel.findOne({where: {Id: userId}});
                if (!user) {
                    return next({status: 400, message: 'USER_NOT_FOUND'});
                }
                if (user.dataValues.status === "Active") {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(decryptedPassword, salt);
                    const user3 = await db.userModel.update({password: hashedPassword}, {where: {id: userId}});
                    next({status: 200, message: 'PASSWORD_UPDATED_SUCCESSFULLY'});
                } else {
                    next({status: 400, message: 'USER_NOT_ACTIVATED!'});
                }
            }
        }
    } catch (e) {
        next({status: 500, message: e});
    }
}

exports.logout = async (req, next) => {
    try {
        // Passport's logout method, which removes the user's session
        req.logout((err) => {
            if (err) {
                next({status: 400, message: err});
            } else {
                next({status: 200, message: 'LOGGED_OUT_SUCCESSFULLY'});
            }
        });
    } catch (e) {
        next({status: 500, message: e});
    }
}

function generateToken(user, next) {
    try {
        const token = jwt.sign(user, config.jwtSecret, {expiresIn: config.jwt.options.expiresIn});
        next(token);
    } catch (err) {
        console.error('TOKEN_ERROR:', err);
    }
}

exports.verifyEmailOTP = async (req, next) => {
    try {
        let user = {
            email: req.user.email,
            id: req.user.id,
            fullName: req.user.fullName,
            customerCode: req.user.customerCode,
            locationId: req.user.cityId
        };
        const query = `SELECT DISTINCT customers_categories_mapping.Id,
                                       customers_categories_mapping.CustomerName,
                                       customers_categories_mapping.CustomerCode,
                                       GROUP_CONCAT(categories.name) AS Categories
                       FROM logione.customers_categories_mapping   
                                JOIN logione.categories ON customers_categories_mapping.categoryId = categories.categoryId
                       WHERE customers_categories_mapping.CustomerCode = ${req.user.customerCode}
                       GROUP BY customers_categories_mapping.CustomerCode;`

        const customerDetails = await db.sequelize.query(query, {type: db.sequelize.QueryTypes.SELECT});
        generateToken(user, token => {
            next({
                status: 200,
                email: req.user.email,
                id: req.user.id,
                fullName: req.user.fullName,
                token: token,
                expiresIn: '3600',
                customerCode: req.user.customerCode,
                customerName: customerDetails[0].CustomerName,
                locationId: req.user.cityId,
                categories: customerDetails[0].Categories.split(','),
                message: "LOGGED_IN_SUCCESSFULLY"
            });
        });
    } catch (e) {
        console.log(e)
        next({status: 500, message: e});
    }
}

// Update User Logic
exports.updateUser = async (userId, body, next) => {
    try {
        if (!(body.fullName && /^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(body.fullName))) {
            return next({status: 500, message: 'INVALID_NAME'});
        }else if (!body.customerCode){
            return next({status: 500, message: 'CUSTOMER_CODE_MANDATORY'});
        }else if (!body.locationId){
            return next({status: 500, message: 'LOCATION_MANDATORY'});
        }else {
            await db.userModel.update({
                cityId: body.locationId,
                customerCode: body.customerCode
            }, {where: {id: userId}});
            return next({status: 200, message: 'USER_UPDATED_SUCCESSFULLY'});
        }
    } catch (e) {
        console.log(e)
        next({status: 500, message: e});
    }
}

