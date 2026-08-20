import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "../lib/db.ts",
});


module.exports = sequelize;