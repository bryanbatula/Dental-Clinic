const pool = require('../config/db');

const Client = {
  async getAll() {
    const res = await pool.query('SELECT * FROM clients ORDER BY id DESC');
    return res.rows;
  },
  async getAllPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countRes = await pool.query('SELECT COUNT(*) as total FROM clients');
    const total = parseInt(countRes.rows[0].total);
    
    // Get paginated results
    const res = await pool.query(
      'SELECT * FROM clients ORDER BY id DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return {
      clients: res.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  },
  async getById(id) {
    const res = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    return res.rows[0];
  },
  async getWithAppointments(id) {
    const clientRes = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    const appointmentsRes = await pool.query(`
      SELECT a.*, s.name as service_name
      FROM appointments a
      JOIN services s ON a.service = s.id
      WHERE a.client_id = $1
      ORDER BY a.appointment_time DESC
    `, [id]);
    
    return {
      client: clientRes.rows[0],
      appointments: appointmentsRes.rows
    };
  },
  async create(data) {
    const { 
      name, email, phone, dob, address, medicalHistory, notes,
      dentalChart, presentOralComplaint, medicalInformation, 
      dentalInformation, previousDentalCare, clinicDentist,
      referredBy, occupation, remarks
    } = data;
    
    const res = await pool.query(
      `INSERT INTO clients (
        name, email, phone, dob, address, medical_history, notes,
        dental_chart, present_oral_complaint, medical_information,
        dental_information, previous_dental_care, clinic_dentist,
        referred_by, occupation, remarks
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
      [
        name, email, phone, dob || null, address || null, medicalHistory || null, notes || null,
        dentalChart || '{}', presentOralComplaint || null, medicalInformation || '{}',
        dentalInformation || '{}', previousDentalCare || null, clinicDentist || null,
        referredBy || null, occupation || null, remarks || 'Good'
      ]
    );
    return res.rows[0];
  },
  async update(id, data) {
    const { 
      name, email, phone, dob, address, medicalHistory, notes,
      dentalChart, presentOralComplaint, medicalInformation,
      dentalInformation, previousDentalCare, clinicDentist,
      referredBy, occupation, remarks
    } = data;
    
    const res = await pool.query(
      `UPDATE clients SET 
        name = $1, email = $2, phone = $3, dob = $4, address = $5, medical_history = $6, notes = $7,
        dental_chart = $8, present_oral_complaint = $9, medical_information = $10,
        dental_information = $11, previous_dental_care = $12, clinic_dentist = $13,
        referred_by = $14, occupation = $15, remarks = $16
      WHERE id = $17 RETURNING *`,
      [
        name, email, phone, dob || null, address || null, medicalHistory || null, notes || null,
        dentalChart || '{}', presentOralComplaint || null, medicalInformation || '{}',
        dentalInformation || '{}', previousDentalCare || null, clinicDentist || null,
        referredBy || null, occupation || null, remarks || 'Good', id
      ]
    );
    return res.rows[0];
  },
  async delete(id) {
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    return true;
  },
  
  async getWeeklyStats() {
    // Get the start of the current week (Monday)
    const res = await pool.query(`
      SELECT COUNT(*) as added_this_week
      FROM clients 
      WHERE created_at >= date_trunc('week', CURRENT_DATE)
      AND created_at < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week'
    `);
    return parseInt(res.rows[0].added_this_week);
  },
  
  async getAllPaginatedWithSearch(page = 1, limit = 10, searchTerm = '') {
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let queryParams = [limit, offset];
    let countParams = [];
    
    if (searchTerm && searchTerm.trim()) {
      whereClause = 'WHERE LOWER(name) LIKE LOWER($3)';
      const searchPattern = `%${searchTerm.trim()}%`;
      queryParams.push(searchPattern);
      countParams.push(searchPattern);
    }
    
    // Get total count
    const countQuery = searchTerm && searchTerm.trim() 
      ? 'SELECT COUNT(*) as total FROM clients WHERE LOWER(name) LIKE LOWER($1)'
      : 'SELECT COUNT(*) as total FROM clients';
    
    const countRes = await pool.query(countQuery, countParams);
    const total = parseInt(countRes.rows[0].total);
    
    // Get paginated results
    const dataQuery = `SELECT * FROM clients ${whereClause} ORDER BY id DESC LIMIT $1 OFFSET $2`;
    const res = await pool.query(dataQuery, queryParams);
    
    return {
      clients: res.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      searchTerm: searchTerm
    };
  }
};

module.exports = Client; 