const conn = require("../config/db_connection");

const getAllPengaduan = () => {
  const SQLQuery = `
    SELECT
      id_pengaduan,
      first_name,
      last_name,
      email,
      nomor_telpon,
      pesan,
      created_at
    FROM pengaduan_user
    ORDER BY id_pengaduan DESC
  `;

  return conn.execute(SQLQuery);
};

const searchByID = (id) => {
  const SQLQuery = `
    SELECT
      id_pengaduan,
      first_name,
      last_name,
      email,
      nomor_telpon,
      pesan,
      created_at
    FROM pengaduan_user
    WHERE id_pengaduan = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [id]);
};

const countPengaduan = () => {
  const SQLQuery = `
    SELECT COUNT(*) AS total
    FROM pengaduan_user
  `;

  return conn.execute(SQLQuery);
};

const addPengaduan = (
  first_name,
  last_name,
  email,
  nomor_telpon,
  pesan
) => {
  const SQLQuery = `
    INSERT INTO pengaduan_user
    (
      first_name,
      last_name,
      email,
      nomor_telpon,
      pesan
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  return conn.execute(SQLQuery, [
    first_name,
    last_name,
    email,
    nomor_telpon,
    pesan,
  ]);
};

const deletePengaduan = (id) => {
  const SQLQuery = `
    DELETE FROM pengaduan_user
    WHERE id_pengaduan = ?
  `;

  return conn.execute(SQLQuery, [id]);
};

module.exports = {
  getAllPengaduan,
  searchByID,
  countPengaduan,
  addPengaduan,
  deletePengaduan,
};