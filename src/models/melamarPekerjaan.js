const conn = require("../config/db_connection");

const reqMelamarPekerjaan = (
  idPostPekerjaan,
  idPelamar,
  createdAt,
  status = "pending"
) => {
  const SQLQuery = `
    INSERT INTO melamar_pekerjaan
    (
      id_post_pekerjaan,
      id_pelamar,
      createdAt,
      status
    )
    VALUES (?, ?, ?, ?)
  `;

  return conn.execute(SQLQuery, [
    idPostPekerjaan,
    idPelamar,
    createdAt,
    status,
  ]);
};

const checkAlreadyApplied = (
  idPostPekerjaan,
  idPelamar
) => {
  const SQLQuery = `
    SELECT id_lamaran_pekerjaan
    FROM melamar_pekerjaan
    WHERE id_post_pekerjaan = ?
      AND id_pelamar = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [
    idPostPekerjaan,
    idPelamar,
  ]);
};

const updateStatus = (
  status,
  idLamaranPekerjaan
) => {
  const SQLQuery = `
    UPDATE melamar_pekerjaan
    SET status = ?
    WHERE id_lamaran_pekerjaan = ?
  `;

  return conn.execute(SQLQuery, [
    status,
    idLamaranPekerjaan,
  ]);
};

const getMelamarHistoryByIDPelamar = (
  idPelamar
) => {
  const SQLQuery = `
    SELECT
      mp.id_lamaran_pekerjaan,
      mp.status AS status_lamaran,
      mp.createdAt,

      pp.id_post_pekerjaan,
      pp.posisi,

      pr.id_perusahaan,
      pr.nama_perusahaan,

      pl.id_pelamar,
      pl.first_name,
      pl.last_name

    FROM melamar_pekerjaan mp

    INNER JOIN posting_pekerjaan pp
      ON mp.id_post_pekerjaan = pp.id_post_pekerjaan

    INNER JOIN perusahaan pr
      ON pp.id_perusahaan = pr.id_perusahaan

    INNER JOIN pelamar pl
      ON mp.id_pelamar = pl.id_pelamar

    WHERE mp.id_pelamar = ?

    ORDER BY mp.createdAt DESC
  `;

  return conn.execute(SQLQuery, [idPelamar]);
};

const getMelamarHistoryByIDPostingan = (
  idLamaranPekerjaan
) => {
  const SQLQuery = `
    SELECT
      mp.id_lamaran_pekerjaan,
      mp.status,
      mp.createdAt,

      pp.id_post_pekerjaan,
      pp.posisi,

      pr.id_perusahaan,
      pr.nama_perusahaan,

      pl.id_pelamar,
      pl.first_name,
      pl.last_name

    FROM melamar_pekerjaan mp

    INNER JOIN posting_pekerjaan pp
      ON mp.id_post_pekerjaan = pp.id_post_pekerjaan

    INNER JOIN perusahaan pr
      ON pp.id_perusahaan = pr.id_perusahaan

    INNER JOIN pelamar pl
      ON mp.id_pelamar = pl.id_pelamar

    WHERE mp.id_lamaran_pekerjaan = ?

    LIMIT 1
  `;

  return conn.execute(SQLQuery, [
    idLamaranPekerjaan,
  ]);
};

const getDataMelamarPekerjaan = () => {
  const SQLQuery = `
    SELECT
      mp.id_lamaran_pekerjaan,
      mp.createdAt,
      mp.status,

      pl.id_pelamar,
      pl.first_name,
      pl.last_name,

      pp.id_post_pekerjaan,
      pp.posisi,

      pr.id_perusahaan,
      pr.nama_perusahaan

    FROM melamar_pekerjaan mp

    INNER JOIN pelamar pl
      ON mp.id_pelamar = pl.id_pelamar

    INNER JOIN posting_pekerjaan pp
      ON mp.id_post_pekerjaan = pp.id_post_pekerjaan

    INNER JOIN perusahaan pr
      ON pp.id_perusahaan = pr.id_perusahaan

    ORDER BY mp.createdAt DESC
  `;

  return conn.execute(SQLQuery);
};

const countLamaran = () => {
  const SQLQuery = `
    SELECT COUNT(*) AS total
    FROM melamar_pekerjaan
  `;

  return conn.execute(SQLQuery);
};

module.exports = {
  reqMelamarPekerjaan,
  checkAlreadyApplied,
  updateStatus,

  getMelamarHistoryByIDPelamar,
  getMelamarHistoryByIDPostingan,

  getDataMelamarPekerjaan,

  countLamaran,
};