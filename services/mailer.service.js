const config = require('../config/config');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
    host: config.smtpDetails.emailHost,
    port: config.smtpDetails.emailPort,
    secure: false,
    service: config.smtpDetails.emailService,
    auth: {
        user: config.smtpDetails.mailAuthUser,
        pass: config.smtpDetails.mailAuthPassword,
    },
});


exports.activeUserMail = async (userObj, password, next) => {
    let file = fs.readFileSync(
        path.join(__dirname, '../email-templates', 'userActive.html'),
        'utf8'
    );
    let templateHtmlBody = file.replace('$$FULLNAME$$', userObj.fullName).replace('$$PASSWORD$$', password);

    let mailOptions = {
        from: config.smtpDetails.fromMail,
        to: userObj.email,
        subject: 'User Approval - Logione',
        html: templateHtmlBody,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            next({status: 400, message: error});
            // res.send({success: false, mes/sage: error});
        } else {
            console.log('Email sent: ' + info.response);
            next({status: 200, message: 'Verification code sent to your Email Id'});
        }
    });
};

exports.otpGenerationForTwoWay = async (userObj, OTP, done) => {
    let file = fs.readFileSync(
        path.join(__dirname, '../email-templates', '2wayAuthentication.html'),
        'utf8'
    );
    let templateHtmlBody = file.replace('$$FULLNAME$$', userObj.fullName).replace('$$PASSWORD$$', OTP);

    let mailOptions = {
        from: config.smtpDetails.fromMail,
        to: userObj.email,
        subject: 'Two Way Authentication - Logione',
        html: templateHtmlBody,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {console.log(error);
            done({
                status: 400,
                message: 'Error in sending Mail',
            });
        } else {
            console.log(info,"infoooooo");
            done({
                status: 200,
                message: 'Mail sent Successfully..!',
            });
        }
    });
};
