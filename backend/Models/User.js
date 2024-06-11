module.exports = (Sequelize, DataTypes) => {
    const User = Sequelize.define("User", {

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
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
        }
    });
    return User
}