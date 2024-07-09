module.exports = (Sequelize, DataTypes) => {
    const User = Sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        tokenId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        passW:{
            type: DataTypes.STRING,
        },
        contactNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        roleName:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        roleId:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        authToken:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
    return User
}