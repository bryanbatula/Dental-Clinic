const pool = require('../config/db');

// Helper function to convert string decimal values to numbers
const processFinancialData = (treatment) => {
  return {
    ...treatment,
    charge: parseFloat(treatment.charge || 0),
    paid: parseFloat(treatment.paid || 0),
    balance: parseFloat(treatment.balance || 0)
  };
};

const Treatment = {
  async getAll() {
    const res = await pool.query(`
      SELECT t.*, c.name as client_name 
      FROM treatment_records t
      JOIN clients c ON t.client_id = c.id
      ORDER BY t.date_performed DESC
    `);
    return res.rows.map(processFinancialData);
  },

  async getAllPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countRes = await pool.query('SELECT COUNT(*) as total FROM treatment_records');
    const total = parseInt(countRes.rows[0].total);
    
    // Get paginated results
    const res = await pool.query(`
      SELECT t.*, c.name as client_name 
      FROM treatment_records t
      JOIN clients c ON t.client_id = c.id
      ORDER BY t.date_performed DESC 
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    return {
      treatments: res.rows.map(processFinancialData),
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
      SELECT t.*, c.name as client_name 
      FROM treatment_records t
      JOIN clients c ON t.client_id = c.id
      WHERE t.id = $1
    `, [id]);
    return res.rows[0] ? processFinancialData(res.rows[0]) : null;
  },

  async getByClientId(clientId) {
    const res = await pool.query(`
      SELECT * FROM treatment_records 
      WHERE client_id = $1 
      ORDER BY date_performed DESC
    `, [clientId]);
    return res.rows.map(processFinancialData);
  },

  async create(data) {
    const { 
      clientId, datePerformed, toothNumber, description, 
      charge, paid, dentist, notes 
    } = data;
    
    const balance = parseFloat(charge || 0) - parseFloat(paid || 0);
    
    // Validate and trim tooth number
    const validatedToothNumber = toothNumber ? toothNumber.toString().trim().substring(0, 20) : null;
    
    const res = await pool.query(
      `INSERT INTO treatment_records (
        client_id, date_performed, tooth_number, description, 
        charge, paid, balance, dentist, notes, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
      [
        clientId, datePerformed, validatedToothNumber, description || null,
        parseFloat(charge || 0), parseFloat(paid || 0), balance,
        dentist || null, notes || null
      ]
    );
    return processFinancialData(res.rows[0]);
  },

  async update(id, data) {
    const { 
      clientId, datePerformed, toothNumber, description, 
      charge, paid, dentist, notes 
    } = data;
    
    const balance = parseFloat(charge || 0) - parseFloat(paid || 0);
    
    // Validate and trim tooth number
    const validatedToothNumber = toothNumber ? toothNumber.toString().trim().substring(0, 20) : null;
    
    const res = await pool.query(
      `UPDATE treatment_records SET 
        client_id = $1, date_performed = $2, tooth_number = $3, description = $4,
        charge = $5, paid = $6, balance = $7, dentist = $8, notes = $9
      WHERE id = $10 RETURNING *`,
      [
        clientId, datePerformed, validatedToothNumber, description || null,
        parseFloat(charge || 0), parseFloat(paid || 0), balance,
        dentist || null, notes || null, id
      ]
    );
    return processFinancialData(res.rows[0]);
  },

  async addPayment(id, amount, notes = null) {
    // Get current record
    const current = await this.getById(id);
    if (!current) throw new Error('Treatment record not found');
    
    const newPaid = parseFloat(current.paid) + parseFloat(amount);
    const newBalance = parseFloat(current.charge) - newPaid;
    
    // Handle notes update logic
    let updatedNotes = current.notes;
    if (notes && notes.trim()) {
      if (updatedNotes) {
        updatedNotes = updatedNotes + '\n' + notes.trim();
      } else {
        updatedNotes = notes.trim();
      }
    }
    
    const res = await pool.query(
      `UPDATE treatment_records SET 
        paid = $1, balance = $2, notes = $3
      WHERE id = $4 RETURNING *`,
      [newPaid, newBalance, updatedNotes, id]
    );
    return processFinancialData(res.rows[0]);
  },

  async getClientSummary(clientId) {
    const res = await pool.query(`
      SELECT 
        COUNT(*) as total_treatments,
        SUM(charge) as total_charges,
        SUM(paid) as total_paid,
        SUM(balance) as total_balance
      FROM treatment_records 
      WHERE client_id = $1
    `, [clientId]);
    
    const summary = res.rows[0];
    return {
      totalTreatments: parseInt(summary.total_treatments || 0),
      totalCharges: parseFloat(summary.total_charges || 0),
      totalPaid: parseFloat(summary.total_paid || 0),
      totalBalance: parseFloat(summary.total_balance || 0)
    };
  },

  async getOverallSummary() {
    const res = await pool.query(`
      SELECT 
        COUNT(*) as total_treatments,
        SUM(charge) as total_charges,
        SUM(paid) as total_paid,
        SUM(balance) as total_balance,
        COUNT(DISTINCT client_id) as total_clients
      FROM treatment_records
    `);
    
    const summary = res.rows[0];
    return {
      totalTreatments: parseInt(summary.total_treatments || 0),
      totalCharges: parseFloat(summary.total_charges || 0),
      totalPaid: parseFloat(summary.total_paid || 0),
      totalBalance: parseFloat(summary.total_balance || 0),
      totalClients: parseInt(summary.total_clients || 0)
    };
  },

  async delete(id) {
    await pool.query('DELETE FROM treatment_records WHERE id = $1', [id]);
    return true;
  },
  
  async getAllPaginatedWithSearch(page = 1, limit = 10, searchTerm = '') {
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let queryParams = [limit, offset];
    let countParams = [];
    
    if (searchTerm && searchTerm.trim()) {
      whereClause = 'WHERE (LOWER(c.name) LIKE LOWER($3) OR LOWER(t.description) LIKE LOWER($3) OR LOWER(t.dentist) LIKE LOWER($3))';
      const searchPattern = `%${searchTerm.trim()}%`;
      queryParams.push(searchPattern);
      countParams.push(searchPattern);
    }
    
    // Get total count
    const countQuery = searchTerm && searchTerm.trim() 
      ? `SELECT COUNT(*) as total FROM treatment_records t
         JOIN clients c ON t.client_id = c.id
         WHERE (LOWER(c.name) LIKE LOWER($1) OR LOWER(t.description) LIKE LOWER($1) OR LOWER(t.dentist) LIKE LOWER($1))`
      : 'SELECT COUNT(*) as total FROM treatment_records';
    
    const countRes = await pool.query(countQuery, countParams);
    const total = parseInt(countRes.rows[0].total);
    
    // Get paginated results with joins
    const dataQuery = `
      SELECT t.*, c.name as client_name 
      FROM treatment_records t
      JOIN clients c ON t.client_id = c.id
      ${whereClause}
      ORDER BY t.date_performed DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const res = await pool.query(dataQuery, queryParams);
    
    return {
      treatments: res.rows.map(processFinancialData),
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

module.exports = Treatment; 