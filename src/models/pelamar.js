const conn = require("../config/db_connection");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const getAllPelamar = () => {
  const SQLQuery = `
    SELECT
      id_pelamar,
      email,
      role,
      first_name,
      last_name,
      about_me,
      profile_pict,
      curriculum_vitae,
      created_at
    FROM pelamar
    ORDER BY id_pelamar DESC
  `;

  return conn.execute(SQLQuery);
};

const countPelamar = () => {
  return conn.execute(
    "SELECT COUNT(*) AS total FROM pelamar"
  );
};

const searchByID = (id) => {
  const SQLQuery = `
    SELECT
      id_pelamar,
      email,
      role,
      first_name,
      last_name,
      about_me,
      profile_pict,
      curriculum_vitae,
      created_at
    FROM pelamar
    WHERE id_pelamar = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [id]);
};

const searchByEmail = (email) => {
  const SQLQuery = `
    SELECT *
    FROM pelamar
    WHERE email = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [email]);
};

const addPelamar = async (
  email,
  plainPassword,
  role,
  first_name,
  last_name
) => {
  const hashedPass = await bcrypt.hash(
    plainPassword,
    SALT_ROUNDS
  );

  const SQLQuery = `
    INSERT INTO pelamar
    (
      email,
      password,
      role,
      first_name,
      last_name
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  return conn.execute(SQLQuery, [
    email,
    hashedPass,
    role,
    first_name,
    last_name,
  ]);
};

const updateDataPelamar = (
  idPelamar,
  first_name,
  last_name,
  email,
  aboutMe
) => {
  const SQLQuery = `
    UPDATE pelamar
    SET
      first_name = ?,
      last_name = ?,
      email = ?,
      about_me = ?
    WHERE id_pelamar = ?
  `;

  return conn.execute(SQLQuery, [
    first_name,
    last_name,
    email,
    aboutMe,
    idPelamar,
  ]);
};

const updateProfilePictPelamar = (
  profilePict,
  idPelamar
) => {
  const SQLQuery = `
    UPDATE pelamar
    SET profile_pict = ?
    WHERE id_pelamar = ?
  `;

  return conn.execute(SQLQuery, [
    profilePict,
    idPelamar,
  ]);
};

const updateCV = (
  cvPath,
  idPelamar
) => {
  const SQLQuery = `
    UPDATE pelamar
    SET curriculum_vitae = ?
    WHERE id_pelamar = ?
  `;

  return conn.execute(SQLQuery, [
    cvPath,
    idPelamar,
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
    UPDATE pelamar
    SET password = ?
    WHERE id_pelamar = ?
  `;

  return conn.execute(SQLQuery, [
    hashedPass,
    id,
  ]);
};

const deletePelamar = (id) => {
  const SQLQuery = `
    DELETE FROM pelamar
    WHERE id_pelamar = ?
  `;

  return conn.execute(SQLQuery, [id]);
};

const getProfilePictByID = (
  idPelamar
) => {
  const SQLQuery = `
    SELECT profile_pict
    FROM pelamar
    WHERE id_pelamar = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [
    idPelamar,
  ]);
};

const getCVByID = (
  idPelamar
) => {
  const SQLQuery = `
    SELECT curriculum_vitae
    FROM pelamar
    WHERE id_pelamar = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [
    idPelamar,
  ]);
};

module.exports = {
  getAllPelamar,
  countPelamar,

  searchByID,
  searchByEmail,

  addPelamar,

  updateDataPelamar,
  updateProfilePictPelamar,
  updateCV,
  updatePasswordByID,

  getProfilePictByID,
  getCVByID,

  deletePelamar,
};