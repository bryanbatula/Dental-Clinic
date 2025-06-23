const db = require('./db');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'migrations', '001_create_services.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf8');

    // Execute the SQL
    await db.query(sqlContent);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase; 