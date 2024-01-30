const DataTypes = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        mobileNumber: {
            type: DataTypes.STRING,
        },
        customerCode: {
            type: DataTypes.STRING,
        },
        accessRequest: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING
        },
        cityId: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.STRING
        },
        otpCount:{
            type: DataTypes.INTEGER,
            default: 0
        }
    }, {
        tableName: 'user',
        timestamps: false,
        paranoid: false
    })
}
