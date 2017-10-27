import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

const snakeToCamel = s => s.charAt(0).toUpperCase() + s.slice(1).replace(/(_\w)/g, m => m[1].toUpperCase());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

const db = {};

// Loop through models folder and imports all files that are not index.js or hidden
fs.readdirSync(__dirname).filter(file => file.indexOf('.') !== 0 && file !== 'index.js').forEach((file) => {
  const model = sequelize.import(path.join(__dirname, file));
  db[snakeToCamel(model.name)] = model;
});


/*
// Import models one by one
const db = {
  User: sequelize.import('./user'),
  Board: sequelize.import('./board'),
  Suggestion: sequelize.import('./suggestion'),
};
*/

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
// db.Sequelize = Sequelize;

export default db;
