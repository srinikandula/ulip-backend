const DataTypes = require('sequelize');

module.exports = (sequelize) => {
    const userAuth = sequelize.define('user_otp_auth', {
        emailOtp: {
            type: DataTypes.INTEGER,
            unique: true
        },
        userId: {
            type: DataTypes.INTEGER,
        },
        expiresIn: {
            type: DataTypes.DATE
        },
        status:{
          type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'user_otp_auth',
        timestamps: true,
        paranoid: false
    })
    return userAuth

}