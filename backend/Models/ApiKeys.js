module.exports = (Sequelize, DataTypes) => {
    const ApiKeys = Sequelize.define("ApiKeys", {

        key: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        ownerName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        applicationName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false
        },
        secKey:{
            type:DataTypes.STRING,
        },
        secValidity:{
            type:DataTypes.DATE,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false
        },
        ip:{
            type:DataTypes.STRING,
            allowNull:false
        },
        active:{
            type:DataTypes.BOOLEAN,
            defaultValue:true
        }
        
        

    });
    return ApiKeys
}