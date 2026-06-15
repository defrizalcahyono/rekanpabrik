const conn = require("../config/db_connection");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const getAllAdmin = () => {
  const SQLQuery = `
    SELECT
      id_admin,
      email,
      role,
      name,
      created_at
    FROM admin
    ORDER BY id_admin DESC
  `;

  return conn.execute(SQLQuery);
};

const countAdmin = () => {
  return conn.execute(
    "SELECT COUNT(*) AS total FROM admin"
  );
};

const searchByID = (id) => {
  const SQLQuery = `
    SELECT
      id_admin,
      email,
      role,
      name,
      created_at
    FROM admin
    WHERE id_admin = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [id]);
};

const searchByEmail = (email) => {
  const SQLQuery = `
    SELECT *
    FROM admin
    WHERE email = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [email]);
};

const addAdmin = async (
  email,
  plainPassword,
  role,
  name
) => {
  const hashedPass = await bcrypt.hash(
    plainPassword,
    SALT_ROUNDS
  );

  const SQLQuery = `
    INSERT INTO admin
    (
      email,
      password,
      role,
      name
    )
    VALUES (?, ?, ?, ?)
  `;

  return conn.execute(SQLQuery, [
    email,
    hashedPass,
    role,
    name
  ]);
};

const updateProfileAdmin = (
  email,
  name,
  id_admin
) => {
  const SQLQuery = `
    UPDATE admin
    SET
      email = ?,
      name = ?
    WHERE id_admin = ?
  `;

  return conn.execute(SQLQuery, [
    email,
    name,
    id_admin,
  ]);
};

const updateProfilePhoto = (
  profilePhoto,
  id_admin
) => {
  const SQLQuery = `
    UPDATE admin
    SET profile_photo = ?
    WHERE id_admin = ?
  `;

  return conn.execute(SQLQuery, [
    profilePhoto,
    id_admin,
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
    UPDATE admin
    SET password = ?
    WHERE id_admin = ?
  `;

  return conn.execute(SQLQuery, [
    hashedPass,
    id,
  ]);
};

const deleteAdmin = (id) => {
  const SQLQuery = `
    DELETE FROM admin
    WHERE id_admin = ?
  `;

  return conn.execute(SQLQuery, [id]);
};

module.exports = {
  getAllAdmin,
  countAdmin,
  searchByID,
  searchByEmail,
  addAdmin,
  updateProfileAdmin,
  updateProfilePhoto,
  updatePasswordByID,
  deleteAdmin,
};