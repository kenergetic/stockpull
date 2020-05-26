const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  AV_API_KEY: process.env.AV_API_KEY,
  AV_OUTPUT_SIZE: process.env.AV_OUTPUT_SIZE,
  PORT: process.env.PORT
};