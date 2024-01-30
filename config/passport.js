const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../config/dbConn');
const config = require('./config');

const localLogin = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'emailOtp'
    },
    async (email, emailOtp, done) => {
        try {
            let user = await db.userModel.findOne({where: {email: email}});
            if (!user) {
                done({
                    status: 400,
                    message: 'EMAIL_NOT_FOUND',
                });
            } else {
                const otpDetails = await db.userAuthModel.findOne({where: {userId: user.dataValues.id}});
                if (parseInt(emailOtp) === otpDetails.dataValues.emailOtp) {
                    if (otpDetails.dataValues.status === "active") {
                        if (new Date().getTime() < otpDetails.dataValues.expiresIn) {
                            await db.userAuthModel.update({status: 'expired'}, {where: {userId: user.dataValues.id}});
                            delete user.password;
                            done(null, user);
                        } else {
                            await db.userAuthModel.update({status: 'expired'}, {where: {userId: user.dataValues.id}});
                            done({status: 400, message: 'OTP_EXPIRED'});
                        }
                    } else {
                        done({status: 400, message: 'ALREADY_USED'});
                    }
                } else {
                    done({status: 400, message: 'WRONG_OTP'});
                }
            }
        } catch (e) {
            console.log(e);
            done({status: 400, message: 'error in verifying OTP'});
        }

    }
);

const jwtLogin = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtSecret,
        // algorithms: ['HS256'], // Algorithm used to sign the JWTs
    },
    async (jwtPayload, done) => {
        try {
            let user = await db.userModel.findOne({where: {id: jwtPayload.id}});
            if (!user) {
                return done(null, false);
            }
            done(null, user);
        } catch (e) {
            return done(e, false);
        }
    }
);

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
