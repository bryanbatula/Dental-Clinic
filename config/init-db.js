const db = require('./db');
const fs = require('fs').promises;
const path = require('path');

const migrations = [
  '000_base_schema.sql',
  '001_create_services.sql',
  '002_add_analytics_columns.sql',
  '003_add_dental_chart.sql',
  '004_create_treatment_records.sql',
  '005_add_dentist_notes_to_treatments.sql',
  '006_add_category_to_services.sql',
  '007_increase_tooth_number_field_size.sql',
  '008_make_description_optional.sql',
  '009_make_email_optional.sql',
];

async function initializeDatabase() {
  try {
    for (const migration of migrations) {
      const sqlPath = path.join(__dirname, 'migrations', migration);
      const sqlContent = await fs.readFile(sqlPath, 'utf8');
      await db.query(sqlContent);
      console.log(`Applied migration: ${migration}`);
    }
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