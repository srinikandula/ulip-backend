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
        to: 'Srivyas.kopperla@mahindralogistics.com',
        cc: '29002891@mahindralogistics.com',
        subject: 'User Access Creation - ULIP',
        html: templateHtmlBody
    };

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

