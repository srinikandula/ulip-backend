module.exports = (Sequelize, DataTypes) => {
    const Driver = Sequelize.define("Driver", {

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        DLN: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isTravelling:{
            type:DataTypes.BOOLEAN,
            default:false
        },
        travellingFrom:{
            type:DataTypes.STRING
        },
        travellingTo:{
            type:DataTypes.STRING
        },
        cLocation:{
            type:DataTypes.STRING
        },
        vehicleNo:{
            type:DataTypes.STRING
        },
        productId:{
            type:DataTypes.STRING
        },
        productQuantity:{
            type:DataTypes.INTEGER
        }


    });
    return Driver
}