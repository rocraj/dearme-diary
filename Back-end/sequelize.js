const { Sequelize } = require('sequelize');

const config = require('./config/config.json'); // Import the config file

// Use the environment-specific configuration (e.g., development, test, production)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create a Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    // Additional options (optional)
    logging: false, // Disable logging SQL queries (set to `true` for debugging)
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;