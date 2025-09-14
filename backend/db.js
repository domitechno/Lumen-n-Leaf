import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Alibaba44',
  database: 'lumen_leaf'
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Connected to MySQL!');
    connection.release();
  } catch (err) {
    console.error('Connection error:', err);
  }
})();