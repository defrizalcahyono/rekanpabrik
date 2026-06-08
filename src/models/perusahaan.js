const conn = require("../config/db_connection");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const getAllPerusahaan = () => {
  const SQLQuery = `
    SELECT
      p.id_perusahaan,
      p.nama_perusahaan,
      p.email,
      p.about_me,
      p.profile_pict,
      p.alamat,
      COUNT(pp.id_post_pekerjaan) AS jumlah_posting

    FROM perusahaan p

    LEFT JOIN posting_pekerjaan pp
      ON p.id_perusahaan = pp.id_perusahaan

    GROUP BY p.id_perusahaan

    ORDER BY jumlah_posting DESC
  `;

  return conn.execute(SQLQuery);
};

const countPerusahaan = () => {
  return conn.execute(`
    SELECT COUNT(*) AS total
    FROM perusahaan
  `);
};

const getPerusahaanByID = (idPerusahaan) => {
  const SQLQuery = `
    SELECT
      p.id_perusahaan,
      p.nama_perusahaan,
      p.email,
      p.about_me,
      p.profile_pict,
      p.alamat,
      COUNT(pp.id_post_pekerjaan) AS jumlah_posting

    FROM perusahaan p

    LEFT JOIN posting_pekerjaan pp
      ON p.id_perusahaan = pp.id_perusahaan

    WHERE p.id_perusahaan = ?

    GROUP BY p.id_perusahaan

    LIMIT 1
  `;

  return conn.execute(SQLQuery, [idPerusahaan]);
};

const searchByEmail = (email) => {
  const SQLQuery = `
    SELECT *
    FROM perusahaan
    WHERE email = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [email]);
};

const searchByID = (id) => {
  const SQLQuery = `
    SELECT *
    FROM perusahaan
    WHERE id_perusahaan = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [id]);
};

const addPerusahaan = async (
  email,
  plainPassword,
  role,
  namaPerusahaan
) => {
  const hashedPass = await bcrypt.hash(
    plainPassword,
    SALT_ROUNDS
  );

  const SQLQuery = `
    INSERT INTO perusahaan
    (
      email,
      password,
      role,
      nama_perusahaan
    )
    VALUES (?, ?, ?, ?)
  `;

  return conn.execute(SQLQuery, [
    email,
    hashedPass,
    role,
    namaPerusahaan,
  ]);
};

const updateProfilePictPerusahaan = (
  idPerusahaan,
  profilePict
) => {
  const SQLQuery = `
    UPDATE perusahaan
    SET profile_pict = ?
    WHERE id_perusahaan = ?
  `;

  return conn.execute(SQLQuery, [
    profilePict,
    idPerusahaan,
  ]);
};

const updateDataPerusahaan = (
  idPerusahaan,
  email,
  namaPerusahaan,
  aboutMe,
  alamat
) => {
  const SQLQuery = `
    UPDATE perusahaan
    SET
      email = ?,
      nama_perusahaan = ?,
      about_me = ?,
      alamat = ?
    WHERE id_perusahaan = ?
  `;

  return conn.execute(SQLQuery, [
    email,
    namaPerusahaan,
    aboutMe,
    alamat,
    idPerusahaan,
  ]);
};

const updatePasswordByID = async (
  newPassword,
  id
) => {
  const hashedPass = await bcrypt.hash(
    newPassword,
    SALT_ROUNDS
  );

  const SQLQuery = `
    UPDATE perusahaan
    SET password = ?
    WHERE id_perusahaan = ?
  `;

  return conn.execute(SQLQuery, [
    hashedPass,
    id,
  ]);
};

const getProfilePictByID = (
  idPerusahaan
) => {
  const SQLQuery = `
    SELECT profile_pict
    FROM perusahaan
    WHERE id_perusahaan = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [
    idPerusahaan,
  ]);
};

const cekPelamar = (idPerusahaan) => {
  const SQLQuery = `
    SELECT
      p.nama_perusahaan,

      pel.id_pelamar,
      pel.first_name,
      pel.last_name,
      pel.email,
      pel.profile_pict,
      pel.curriculum_vitae,

      pp.id_post_pekerjaan,
      pp.posisi,

      mp.id_lamaran_pekerjaan,
      mp.status,
      mp.createdAt

    FROM perusahaan p

    INNER JOIN posting_pekerjaan pp
      ON pp.id_perusahaan = p.id_perusahaan

    INNER JOIN melamar_pekerjaan mp
      ON mp.id_post_pekerjaan = pp.id_post_pekerjaan

    INNER JOIN pelamar pel
      ON pel.id_pelamar = mp.id_pelamar

    WHERE p.id_perusahaan = ?

    ORDER BY mp.createdAt DESC
  `;

  return conn.execute(SQLQuery, [
    idPerusahaan,
  ]);
};

const deletePerusahaan = (id) => {
  const SQLQuery = `
    DELETE FROM perusahaan
    WHERE id_perusahaan = ?
  `;

  return conn.execute(SQLQuery, [id]);
};

module.exports = {
  getAllPerusahaan,
  getPerusahaanByID,
  countPerusahaan,

  searchByEmail,
  searchByID,

  addPerusahaan,

  updateProfilePictPerusahaan,
  updateDataPerusahaan,
  updatePasswordByID,

  getProfilePictByID,

  cekPelamar,

  deletePerusahaan,
};