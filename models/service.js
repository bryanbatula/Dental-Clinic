const db = require('../config/db');

class Service {
  static async getAll() {
    const query = 'SELECT * FROM services ORDER BY name';
    const { rows } = await db.query(query);
    return rows;
  }

  static async getById(id) {
    const query = 'SELECT * FROM services WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async create(service) {
    const query = 'INSERT INTO services (name, description, duration, price, category) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [service.name, service.description, service.duration, service.price, service.category || 'General'];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async update(id, service) {
    const query = 'UPDATE services SET name = $1, description = $2, duration = $3, price = $4, category = $5 WHERE id = $6 RETURNING *';
    const values = [service.name, service.description, service.duration, service.price, service.category || 'General', id];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM services WHERE id = $1';
    await db.query(query, [id]);
  }

  static async getStats() {
    try {
      // Get total services count
      const totalQuery = 'SELECT COUNT(*) as total FROM services';
      const { rows: totalRows } = await db.query(totalQuery);
      const totalServices = parseInt(totalRows[0].total);

      // Get services with appointment counts
      const usageQuery = `
        SELECT 
          s.id,
          s.name,
          s.category,
          s.price,
          COUNT(a.id) as appointment_count,
          COALESCE(SUM(s.price), 0) as total_revenue
        FROM services s
        LEFT JOIN appointments a ON s.id = a.service
        GROUP BY s.id, s.name, s.category, s.price
        ORDER BY appointment_count DESC
      `;
      const { rows: usageRows } = await db.query(usageQuery);

      // Get category distribution
      const categoryQuery = `
        SELECT 
          s.category,
          COUNT(s.id) as service_count,
          COUNT(a.id) as appointment_count
        FROM services s
        LEFT JOIN appointments a ON s.id = a.service
        GROUP BY s.category
        ORDER BY service_count DESC
      `;
      const { rows: categoryRows } = await db.query(categoryQuery);

      // Get recent activity (appointments in last 30 days)
      const recentQuery = `
        SELECT COUNT(*) as recent_appointments
        FROM appointments a
        JOIN services s ON a.service = s.id
        WHERE a.appointment_time >= NOW() - INTERVAL '30 days'
      `;
      const { rows: recentRows } = await db.query(recentQuery);

      // Calculate total revenue from all service appointments
      const revenueQuery = `
        SELECT COALESCE(SUM(s.price), 0) as total_revenue
        FROM appointments a
        JOIN services s ON a.service = s.id
        WHERE a.status != 'Cancelled'
      `;
      const { rows: revenueRows } = await db.query(revenueQuery);

      // Get average service price
      const avgPriceQuery = 'SELECT AVG(price) as avg_price FROM services WHERE price > 0';
      const { rows: avgPriceRows } = await db.query(avgPriceQuery);

      return {
        totalServices,
        activeServices: usageRows.filter(s => s.appointment_count > 0).length,
        totalAppointments: usageRows.reduce((sum, s) => sum + parseInt(s.appointment_count), 0),
        totalRevenue: parseFloat(revenueRows[0].total_revenue || 0),
        recentAppointments: parseInt(recentRows[0].recent_appointments || 0),
        averagePrice: parseFloat(avgPriceRows[0].avg_price || 0),
        mostPopularService: usageRows[0] || null,
        categoryDistribution: categoryRows,
        serviceUsage: usageRows
      };
    } catch (error) {
      console.error('Error getting service stats:', error);
      return {
        totalServices: 0,
        activeServices: 0,
        totalAppointments: 0,
        totalRevenue: 0,
        recentAppointments: 0,
        averagePrice: 0,
        mostPopularService: null,
        categoryDistribution: [],
        serviceUsage: []
      };
    }
  }
}

module.exports = Service; 