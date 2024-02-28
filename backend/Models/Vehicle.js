module.exports = (Sequelize, DataTypes) => {
    const Vehicle = Sequelize.define("Vehicle", {

        vehicleNo: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        rc_chasi_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rc_eng_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rc_regn_dt: {
            type: DataTypes.DATE,
            // allowNull: false,
        },
        rc_regn_no: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rc_owner_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rc_present_address: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rc_permanent_address: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rc_vh_class_desc: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rc_fuel_desc: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rc_maker_desc: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rc_color: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rc_fit_upto: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rc_tax_upto: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rc_insurance_comp: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rc_insurance_policy_no: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        rc_insurance_upto: {
            type: DataTypes.DATE,
            // allowNull: false,
        },
        rc_manu_month_yr: {
            type: DataTypes.DATE,
            // allowNull: false,
        },
        rc_status_as_on: {
            type: DataTypes.DATE,
            // allowNull: false,
        },
        rc_status: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        


    });
    return Vehicle
}