module.exports = (Sequelize, DataTypes) => {
    const Logi = Sequelize.define("Logi", {

        Product: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        ProductId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        

    });
    return Logi
}