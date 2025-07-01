const pool = require('../config/db');

const Appointment = {
  async getAll() {
    const res = await pool.query(`
      SELECT a.*, c.name as client_name, s.name as service_name
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service = s.id
      ORDER BY a.appointment_time DESC
    `);
    return res.rows;
  },
  async getAllPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countRes = await pool.query('SELECT COUNT(*) as total FROM appointments');
    const total = parseInt(countRes.rows[0].total);
    
    // Get paginated results with joins
    const res = await pool.query(`
      SELECT a.*, c.name as client_name, s.name as service_name
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service = s.id
      ORDER BY a.appointment_time DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    return {
      appointments: res.rows,
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
    const res = await pool.query(`
      SELECT a.*, c.name as client_name, s.name as service_name
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service = s.id
      WHERE a.id = $1
    `, [id]);
    return res.rows[0];
  },
  async create(data) {
    const { client_id, service, appointment_time, notes, status } = data;
    const res = await pool.query(
      'INSERT INTO appointments (client_id, service, appointment_time, notes, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [client_id, service, appointment_time, notes, status || 'Scheduled']
    );
    return res.rows[0];
  },
  async update(id, data) {
    const { client_id, service, appointment_time, notes, status } = data;
    const res = await pool.query(
      'UPDATE appointments SET client_id = $1, service = $2, appointment_time = $3, notes = $4, status = $5 WHERE id = $6 RETURNING *',
      [client_id, service, appointment_time, notes, status, id]
    );
    return res.rows[0];
  },
  async delete(id) {
    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
    return true;
  },
  async getUpcoming() {
    const res = await pool.query(`
      SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone, s.name as service_name
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service = s.id
      WHERE a.appointment_time > NOW() 
      AND a.status NOT IN ('Cancelled', 'Completed')
      ORDER BY a.appointment_time ASC
    `);
    return res.rows;
  },
  async getAllPaginatedWithSearch(page = 1, limit = 10, searchTerm = '') {
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let queryParams = [limit, offset];
    let countParams = [];
    
    if (searchTerm && searchTerm.trim()) {
      whereClause = 'WHERE (LOWER(c.name) LIKE LOWER($3) OR LOWER(s.name) LIKE LOWER($3))';
      const searchPattern = `%${searchTerm.trim()}%`;
      queryParams.push(searchPattern);
      countParams.push(searchPattern);
    }
    
    // Get total count
    const countQuery = searchTerm && searchTerm.trim() 
      ? `SELECT COUNT(*) as total FROM appointments a
         JOIN clients c ON a.client_id = c.id
         JOIN services s ON a.service = s.id
         WHERE (LOWER(c.name) LIKE LOWER($1) OR LOWER(s.name) LIKE LOWER($1))`
      : 'SELECT COUNT(*) as total FROM appointments';
    
    const countRes = await pool.query(countQuery, countParams);
    const total = parseInt(countRes.rows[0].total);
    
    // Get paginated results with joins
    const dataQuery = `
      SELECT a.*, c.name as client_name, s.name as service_name
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service = s.id
      ${whereClause}
      ORDER BY a.appointment_time DESC
      LIMIT $1 OFFSET $2
    `;
    
    const res = await pool.query(dataQuery, queryParams);
    
    return {
      appointments: res.rows,
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

module.exports = Appointment; 