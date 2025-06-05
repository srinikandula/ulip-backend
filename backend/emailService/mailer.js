const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const transporter = nodemailer.createTransport({
    host: process.env.emailHost,
    port: process.env.emailPort,
    secure: false,
    service: process.env.emailService,
    auth: {
        user: process.env.mailAuthUser,
        pass: process.env.mailAuthPassword,
    },
});

exports.sendMails = async (userObj, done) => {
    let file = fs.readFileSync(
        path.join(__dirname, '../email-templates', 'access.html'),
        'utf8'
    );
    let templateHtmlBody = file
        .replace('$$token$$', userObj.tokenId)
        .replace('$$username$$', userObj.username)
        .replace('$$mobileNo$$', userObj.contactNo)
        .replace('$$Email$$', userObj.email);

    let mailOptions = {
        from: process.env.fromMail,
        to: ['Srivyas.kopperla@mahindralogistics.com','tms.support@mllltd.zohodesk.com'],
        cc: ['MLLPRODUCT-IT@mahindralogistics.com',userObj.email],
        subject: 'User Access Creation - ULIP',
        html: templateHtmlBody
    };
 console.log("------mailOptions",mailOptions)
    try {
        await transporter.sendMail(mailOptions);
        done({
            status: 200,
            message: 'Mail sent successfully!'
        });
    } catch (error) {
        console.error('Error sending mail:', error);
        done({
            status: 400,
            message: 'Error in sending mail'
        });
    }
};

exports.sendKeys = async (userObj, done) => {
    const htmlTemplate = fs.readFileSync('Html/index.html', 'utf8');
    const renderedHtmlContent = htmlTemplate.replace('{apiKey}', userObj.Key)
                .replace('{applicationName}', userObj.applicationName)
                .replace('{ownerName}', userObj.ownerName)
                .replace('{seckey}', userObj.seckey)

    let mailOptions = {
        from: process.env.fromMail,
        to: userObj.email,
        cc: ['Srivyas.kopperla@mahindralogistics.com','29002168@mahindralogistics.com','29002891@mahindralogistics.com'],
        subject: 'ULIP API Key',
        html: renderedHtmlContent
    };
 console.log("------mailOptions",mailOptions)
    try {
        await transporter.sendMail(mailOptions);
        done({
            status: 200,
            message: 'Mail sent successfully!'
        });
    } catch (error) {
        console.error('Error sending mail:', error);
        done({
            status: 400,
            message: 'Error in sending mail'
        });
    }
};

exports.sendEmailPassword = async (userObj, pass, done) => {
    let file = fs.readFileSync(
        path.join(__dirname, '../email-templates', 'forgotPasswordAuthentication.html'),
        'utf8'
    );
    let templateHtmlBody = file.replace('$$FULLNAME$$', userObj.username).replace('$$PASSWORD$$', pass);
    let mailOptions = {
        from: process.env.fromMail,
        to: userObj.email,
        subject: 'Password Reset - ULIP',
        html: templateHtmlBody,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            done({
                status: 400,
                message: 'Error in sending Mail',
            });
        } else {
            done({
                status: 200,
                message: 'Mail sent Successfully..!',
            });
        }
    });
};
